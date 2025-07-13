export class AuctionTimer {
  static startTimer(auctionId: string, duration: number, io: any): void {
    const timers: Record<string, NodeJS.Timeout> = {};
    timers[auctionId] = setTimeout(() => {
      io.emit('auction_ended', auctionId);
      delete timers[auctionId];
    }, duration);
  }
}
