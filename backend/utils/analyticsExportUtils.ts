export class AnalyticsExportUtils {
  static exportData(borrowerData: Record<string, any>, matches: Record<string, any>, recommendations: Record<string, any>, userId: string): any {
    return { export: 'mock' };
  }

  static formatMatch(match: Record<string, any>): any {
    return match;
  }

  static formatRecommendation(rec: Record<string, any>): any {
    return rec;
  }
}
