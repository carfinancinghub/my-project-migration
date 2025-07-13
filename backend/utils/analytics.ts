export const trackEvent = (event: string, data: Record<string, any>): void => {
  console.log(`Tracking event: ${event}`, data);
};
