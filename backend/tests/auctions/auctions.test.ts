import request from 'supertest';
import app from '../../app';
import { UserProfileService } from '@services/user/UserProfileService';
import mongoose from 'mongoose';
import { expect } from '@jest/globals';

jest.mock('mongoose');

describe('Auctions Routes', () => {
  it('should fetch auctions', async () => {
    const mockUser = { id: 'user1', userId: 'user1', name: 'Test', roles: ['user'] };
    (UserProfileService.getProfile as jest.Mock).mockResolvedValue(mockUser);
    const response = await request(app).get('/api/auctions');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ auctions: [] });
  });
});
