/**
 * © 2025 CFH, All Rights Reserved
 * File: auctionController.ts
 * Path: C:\CFH\backend\controllers\auction\auctionController.ts
 * Purpose: Handles all incoming HTTP requests for the auction module.
 * Author: Mini Team
 * Date: 2025-07-05 [1830]
 * Version: 1.0.0
 * VersionID: a2f3c9b7-5e1a-4d3c-8f9a-2b1e6d4c7f8e
 * Crown Certified: Yes
 * Batch ID: Compliance-070525
 * Artifact ID: c1d0b9a8-f7e6-5d4c-3b2a-1f0b9a8f7e6d
 * Save Location: C:\CFH\backend\controllers\auction\auctionController.ts
 */

// --- Dependencies ---
import { Request, Response, NextFunction } from 'express';
import Auction, { IAuction } from '@/models/auction/Auction';
import { getIO } from '@/socket';
import logger from '@utils/logger';
import { NotFoundError, BadRequestError } from '@utils/errors';

// --- Interfaces ---
interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

// --- Constants ---
const MIN_BID_INCREMENT = 100;
const AUCTION_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
};

// --- Controller Functions ---

/**
 * @function getAllActiveAuctions
 * @purpose Fetches all auctions with an 'open' status.
 */
export const getAllActiveAuctions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const auctions: IAuction[] = await Auction.find({ status: AUCTION_STATUS.OPEN }).populate('car');
    res.status(200).json(auctions);
  } catch (error) {
    logger.error('c1d0b9a8: Error fetching active auctions:', error);
    next(error);
  }
};

/**
 * @function getAuctionById
 * @purpose Fetches a single auction by its unique ID.
 */
export const getAuctionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { auctionId } = req.params;
    const auction: IAuction | null = await Auction.findById(auctionId).populate('car');
    if (!auction) {
      throw new NotFoundError('Auction not found');
    }
    res.status(200).json(auction);
  } catch (error) {
    logger.error(`c1d0b9a8: Error fetching auction by ID ${req.params.auctionId}:`, error);
    next(error);
  }
};

/**
 * @function createAuction
 * @purpose Creates a new auction.
 */
export const createAuction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { car, startingPrice, durationMinutes } = req.body;
    const endsAt = new Date(Date.now() + durationMinutes * 60000);

    const newAuction = new Auction({
      car,
      startingPrice,
      currentBid: startingPrice,
      bidHistory: [],
      status: AUCTION_STATUS.OPEN,
      endsAt,
    });

    const savedAuction = await newAuction.save();
    res.status(201).json(savedAuction);
  } catch (error) {
    logger.error('c1d0b9a8: Error creating auction:', error);
    next(error);
  }
};

/**
 * @function submitBid
 * @purpose Submits a new bid to an active auction.
 */
export const submitBid = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { auctionId } = req.params;
    const { amount } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      throw new BadRequestError('User authentication is required to submit a bid.');
    }

    const auction = await Auction.findById(auctionId);
    if (!auction || auction.status !== AUCTION_STATUS.OPEN) {
      throw new BadRequestError('Auction not available for bidding');
    }

    if (new Date() >= auction.endsAt) {
      auction.status = AUCTION_STATUS.CLOSED;
      await auction.save();
      throw new BadRequestError('Auction has ended');
    }

    if (amount < auction.currentBid + MIN_BID_INCREMENT) {
      throw new BadRequestError(`Bid must be at least $${MIN_BID_INCREMENT} higher than the current bid`);
    }

    auction.currentBid = amount;
    auction.currentBidder = userId;
    auction.bidHistory.push({ bidder: userId, amount, timestamp: new Date() });

    const updatedAuction = await auction.save();

    getIO().emit('bid-update', {
      auctionId: updatedAuction._id,
      currentBid: updatedAuction.currentBid,
      bidHistory: updatedAuction.bidHistory,
    });

    res.status(200).json({ success: true, auction: updatedAuction });
  } catch (error) {
    logger.error(`c1d0b9a8: Error submitting bid for auction ${req.params.auctionId}:`, error);
    next(error);
  }
};

/**
 * @function closeAuctionIfExpired
 * @purpose Manually triggers the closure of an auction if its end time has passed.
 */
export const closeAuctionIfExpired = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { auctionId } = req.params;
    const auction = await Auction.findById(auctionId);

    if (!auction) throw new NotFoundError('Auction not found');
    if (auction.status === AUCTION_STATUS.CLOSED) throw new BadRequestError('Auction already closed');
    if (new Date() < auction.endsAt) throw new BadRequestError('Auction has not yet expired');

    auction.status = AUCTION_STATUS.CLOSED;
    const closedAuction = await auction.save();

    getIO().emit('auction-closed', {
      auctionId: closedAuction._id,
      finalBid: closedAuction.currentBid,
    });

    res.status(200).json({ message: 'Auction closed successfully', auction: closedAuction });
  } catch (error) {
    logger.error(`c1d0b9a8: Error closing auction ${req.params.auctionId}:`, error);
    next(error);
  }
};