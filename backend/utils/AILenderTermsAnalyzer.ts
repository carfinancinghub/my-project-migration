interface TermsData {
  id: string;
  terms: Record<string, any>;
}

export class AILenderTermsAnalyzer {
  static async analyzeTerms(termsData: TermsData, userProfile: Record<string, any>): Promise<any> {
    return { analysis: 'mock' };
  }
}
