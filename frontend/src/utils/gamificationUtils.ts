// File: gamificationUtils.ts
// Path: frontend/src/utils/gamificationUtils.ts
// Author: Cod5
// Purpose: Utility functions for gamification logic

export const awardLoyaltyBadge = (count: number): string | null => {
  if (count === 5) return 'Bronze Hauler Badge';
  if (count === 10) return 'Silver Hauler Badge';
  if (count >= 20) return 'Gold Hauler Badge';
  return null;
};