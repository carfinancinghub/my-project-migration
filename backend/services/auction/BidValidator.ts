export class BidValidator {
  static async validateBid(bidData: any): Promise<void> {
    if (!bidData) throw new Error('Invalid bid data');
  }
}
