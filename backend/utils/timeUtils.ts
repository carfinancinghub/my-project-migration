export class TimeUtils {
  static getDaysUntil(futureDate: Date): number {
    const now = new Date();
    return Math.ceil((futureDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  static formatDate(date: Date): string {
    return date.toISOString();
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
