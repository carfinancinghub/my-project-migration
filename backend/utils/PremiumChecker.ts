interface User {
  id: string;
  premium: boolean;
}

export class PremiumChecker {
  static async checkAccess(user: User, featureName: string): Promise<boolean> {
    const features: Record<string, boolean> = {
      lenderExportAnalytics: true,
      aiOptimizerAccess: true,
      contractEnhancer: true,
    };
    return user.premium && features[featureName];
  }
}
