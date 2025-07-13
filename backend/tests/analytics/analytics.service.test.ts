import request from 'supertest';
import app from '../../app';
import { UserProfileService } from '@services/user/UserProfileService';
import mongoose from 'mongoose';
import { AnalyticsExportUtils } from '@utils/analyticsExportUtils';
import { expect } from '@jest/globals';

jest.mock('mongoose');
jest.mock('@utils/analyticsExportUtils');

describe('Analytics Service', () => {
  it('should fetch analytics data', async () => {
    const mockUser = { id: 'user1', userId: 'user1', name: 'Test', roles: ['user'] };
    (UserProfileService.getProfile as jest.Mock).mockResolvedValue(mockUser);
    const response = await request(app).get('/api/analytics/data');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
  });
});
