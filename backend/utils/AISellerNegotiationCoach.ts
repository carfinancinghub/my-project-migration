import { Listing } from '@models/seller/Listing';

export class AISellerNegotiationCoach {
  static async getNegotiationTips(listingId: string, listingsData: any[]): Promise<string> {
    const listing = await Listing.findById(listingId);
    if (!listing) {
      throw new Error('Listing not found');
    }
    return 'mock tips';
  }
}
