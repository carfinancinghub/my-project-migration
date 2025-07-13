import logger from '@config/logger';

export class LoanCalculatorWidget {
  static async calculatePayment(principal: number, annualRate: number, termYears: number): Promise<number> {
    return 100; // Mock payment
  }
}
