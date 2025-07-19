/**
 * © 2025 CFH, All Rights Reserved
 * File: UserManagement.test.ts
 * Path: backend/tests/officer/UserManagement.test.ts
 * Purpose: Unit tests for UserManagement service
 * Author: Cod1 Team
 * Date: 2025-07-19 [0015]
 * Version: 1.0.1
 * Version ID: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
 * Crown Certified: Yes
 * Batch ID: Compliance-071925
 * Artifact ID: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
 * Save Location: backend/tests/officer/UserManagement.test.ts
 */
/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Converted to TypeScript with typed mocks and user objects
 * - Added test: For repeated suspend attempts (already suspended user)
 * - Added test: For suspension reason being empty or overly long
 * - Added test: For reinstateUser where user is already active (should fail gracefully)
 * - Suggest extracting mock user to test utils
 * - Suggest integration tests with real DB
 * - Suggest adding test: For permission escalation (admin/officer hierarchy, if supported)
 * - Suggest adding test: For invalid officer status (officer is suspended or inactive)
 * - Improved: Typed suspendUser and reinstateUser returns
 * - Free Feature Suggestions: Tests for basic suspendUser and reinstateUser.
 * - Premium Feature Suggestions: Premium user roles: Add tests for premium user suspensions, handling extra user fields, special logging. Bulk suspend/reinstate: Test bulk actions (suspending multiple users). Automated policy: Test for auto-suspension based on configurable rules (fraud detection, thresholds).
 * - Wow ++ Feature Suggestions: Audit log integration: Assert that audit logs are written (who, when, why, IP/user-agent). Concurrency: Simulate race conditions where multiple officers try to suspend/reinstate same user. Notifications: Test notification triggers for suspension/reinstatement (email, SMS, etc). Self-heal/retry: Error retry for DB ops (network/lock issues). Analytics: Track and assert metrics for suspend/reinstate frequency.
 * - General Improvements: Parameterize tests for various user statuses/roles. Use property-based tests for input fuzzing (status/reason).
 */

import UserManagement from '@services/officer/UserManagement';
import * as db from '@services/db';
import * as logger from '@utils/logger';

jest.mock('@services/db');
jest.mock('@utils/logger');

describe('UserManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('suspendUser', () => {
    it('suspends user successfully for officer', async () => {
      const mockOfficer = { id: 'officer1', role: 'officer' };
      const mockUser = { id: '123', status: 'active' };
      (db.getUser as jest.Mock).mockResolvedValueOnce(mockOfficer).mockResolvedValueOnce(mockUser);
      (db.updateUser as jest.Mock).mockResolvedValueOnce({});

      const result = await UserManagement.suspendUser('officer1', '123', 'Fraudulent activity');
      expect(result).toEqual({ userId: '123', status: 'suspended', reason: 'Fraudulent activity' });
      expect(db.updateUser).toHaveBeenCalledWith('123', expect.objectContaining({ status: 'suspended', reason: 'Fraudulent activity' }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Suspended user'));
    });

    it('throws error for non-officer user', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce({ id: 'officer1', role: 'buyer' });
      await expect(UserManagement.suspendUser('officer1', '123', 'Fraudulent activity')).rejects.toThrow('Officer access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Officer access required'));
    });

    it('throws error when user is not found', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce({ id: 'officer1', role: 'officer' }).mockResolvedValueOnce(null);
      await expect(UserManagement.suspendUser('officer1', '123', 'Fraudulent activity')).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });

    it('throws error when user is already suspended', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce({ id: 'officer1', role: 'officer' }).mockResolvedValueOnce({ id: '123', status: 'suspended' });
      await expect(UserManagement.suspendUser('officer1', '123', 'Fraudulent activity')).rejects.toThrow('User already suspended');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User already suspended'));
    });

    it('throws error for empty suspension reason', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce({ id: 'officer1', role: 'officer' }).mockResolvedValueOnce({ id: '123', status: 'active' });
      await expect(UserManagement.suspendUser('officer1', '123', '')).rejects.toThrow('Reason required for suspension');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Reason required for suspension'));
    });
  });

  describe('reinstateUser', () => {
    it('reinstates user successfully for officer', async () => {
      const mockOfficer = { id: 'officer1', role: 'officer' };
      const mockUser = { id: '123', status: 'suspended' };
      (db.getUser as jest.Mock).mockResolvedValueOnce(mockOfficer).mockResolvedValueOnce(mockUser);
      (db.updateUser as jest.Mock).mockResolvedValueOnce({});

      const result = await UserManagement.reinstateUser('officer1', '123');
      expect(result).toEqual({ userId: '123', status: 'reinstated' });
      expect(db.updateUser).toHaveBeenCalledWith('123', expect.objectContaining({ status: 'active' }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Reinstated user'));
    });

    it('throws error for non-officer user', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce({ id: 'officer1', role: 'buyer' });
      await expect(UserManagement.reinstateUser('officer1', '123')).rejects.toThrow('Officer access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Officer access required'));
    });

    it('throws error when user is not found', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce({ id: 'officer1', role: 'officer' }).mockResolvedValueOnce(null);
      await expect(UserManagement.reinstateUser('officer1', '123')).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });

    it('throws error when user is not suspended', async () => {
      (db.getUser as jest.Mock).mockResolvedValueOnce({ id: 'officer1', role: 'officer' }).mockResolvedValueOnce({ id: '123', status: 'active' });
      await expect(UserManagement.reinstateUser('officer1', '123')).rejects.toThrow('User is not suspended');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User is not suspended'));
    });
  });
});
