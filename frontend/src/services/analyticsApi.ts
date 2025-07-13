/**
 * @file analyticsApi.ts
 * @path C:\CFH\frontend\src\services\analyticsApi.ts
 * @author Cod1 Team
 * @created 2025-06-11 [1810]
 * @purpose Fetches analytics data from the backend API.
 * @user_impact Enables the frontend to display analytics data.
 * @version 1.0.0
 */
export interface AnalyticsFilters { dateFrom: string; dateTo: string; }

export const fetchAnalytics = async (filters: AnalyticsFilters) => {
  const resp = await fetch(`/api/analytics?from=${filters.dateFrom}&to=${filters.dateTo}`, {
    headers: { 'Accept': 'application/json' },
  });
  const data = await resp.json();
  return data;
};
