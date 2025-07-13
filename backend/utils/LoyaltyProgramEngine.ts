export class LoyaltyProgramEngine {
  static async addPoints(userId: string, action: string): Promise<number> {
    const pointsMap: Record<string, number> = {
      'Completed Financing Deal': 100,
      'Completed Auction': 50,
      'Hired Hauler': 30,
      'Sold Car': 20,
    };
    return pointsMap[action] || 0;
  }
}
