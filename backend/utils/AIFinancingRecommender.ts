interface FinancingOption {
  id: string;
  terms: Record<string, any>;
}

export class AIFinancingRecommender {
  static async recommend(financingOptions: FinancingOption[]): Promise<FinancingOption> {
    return financingOptions[0] || { id: 'mock', terms: {} };
  }
}
