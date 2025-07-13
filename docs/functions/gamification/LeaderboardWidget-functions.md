LeaderboardWidget Functions Summary
Component: LeaderboardWidget

Purpose: Renders a gamified leaderboard displaying user rankings, scores, and badges for buyers or service providers.
Inputs:
userType (string, required): Type of user ('buyer' or 'serviceProvider').
maxRows (number, optional): Maximum number of rows to display (default: 10).


Outputs:
JSX element rendering a table with columns for rank, username, score, and badges.
Error message if data fetch fails.


Dependencies:
React (useState, useEffect)
PropTypes
@utils/logger for error logging
@services/api/gamification for fetching leaderboard data
LeaderboardWidget.css for styling



