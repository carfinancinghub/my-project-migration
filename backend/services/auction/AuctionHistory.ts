// Date: 062625 [1000], © 2025 CFH
export class AuctionHistory {
  async getHistory(userId: string): Promise<any> {
    return { userId, history: [] };
  }
}
