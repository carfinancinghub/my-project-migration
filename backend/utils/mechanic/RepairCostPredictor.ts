export class RepairCostPredictor {
  static async predictCost(taskId: string, user: any): Promise<number> {
    try {
      return 1000; // Mock cost
    } catch (error) {
      throw new Error(`Prediction error: ${(error as Error).message}`);
    }
  }
}
