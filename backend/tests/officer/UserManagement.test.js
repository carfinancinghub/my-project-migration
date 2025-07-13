// File: UserManagement.test.js
// Path: C:\CFH\backend\tests\officer\UserManagement.test.js
// Purpose: Unit tests for UserManagement service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

const UserManagement = require('@services/officer/UserManagement');
const db = require('@services/db');
const logger = require('@utils/logger');

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
      db.getUser.mockResolvedValueOnce(mockOfficer).mockResolvedValueOnce(mockUser);
      db.updateUser.mockResolvedValueOnce({});

      const result = await UserManagement.suspendUser('officer1', '123', 'Fraudulent activity');
      expect(result).toEqual({ userId: '123', status: 'suspended', reason: 'Fraudulent activity' });
      expect(db.updateUser).toHaveBeenCalledWith('123', expect.objectContaining({ status: 'suspended', reason: 'Fraudulent activity' }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Suspended user'));
    });

    it('throws error for non-officer user', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'buyer' });
      await expect(UserManagement.suspendUser('officer1', '123', 'Fraudulent activity')).rejects.toThrow('Officer access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Officer access required'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'officer' }).mockResolvedValueOnce(null);
      await expect(UserManagement.suspendUser('officer1', '123', 'Fraudulent activity')).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });
  });

  describe('reinstateUser', () => {
    it('reinstates user successfully for officer', async () => {
      const mockOfficer = { id: 'officer1', role: 'officer' };
      const mockUser = { id: '123', status: 'suspended' };
      db.getUser.mockResolvedValueOnce(mockOfficer).mockResolvedValueOnce(mockUser);
      db.updateUser.mockResolvedValueOnce({});

      const result = await UserManagement.reinstateUser('officer1', '123');
      expect(result).toEqual({ userId: '123', status: 'reinstated' });
      expect(db.updateUser).toHaveBeenCalledWith('123', expect.objectContaining({ status: 'active' }));
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Reinstated user'));
    });

    it('throws error for non-officer user', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'buyer' });
      await expect(UserManagement.reinstateUser('officer1', '123')).rejects.toThrow('Officer access required');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Officer access required'));
    });

    it('throws error when user is not found', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'officer' }).mockResolvedValueOnce(null);
      await expect(UserManagement.reinstateUser('officer1', '123')).rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User not found'));
    });

    it('throws error when user is not suspended', async () => {
      db.getUser.mockResolvedValueOnce({ id: 'officer1', role: 'officer' }).mockResolvedValueOnce({ id: '123', status: 'active' });
      await expect(UserManagement.reinstateUser('officer1', '123')).rejects.toThrow('User is not suspended');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User is not suspended'));
    });
  });
});

