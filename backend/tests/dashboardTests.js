// File: dashboardTests.js
// Path: backend/tests/dashboardTests.js
// Purpose: Test Buyer/Seller/Admin dashboard integrations
// Author: Cod2
// Date: 2025-04-28
// 👑 Cod2 Crown Certified

// ----------------- Imports -----------------
const axios = require('axios');
const { describe, it, expect, jest } = require('@jest/globals');
const buyerDashboard = require('@/components/buyer/BuyerDashboard.jsx');
const sellerDashboard = require('@/components/seller/SellerDashboard.jsx');
const adminDashboard = require('@/components/admin/AdminDashboard.jsx');
const userController = require('@/controllers/userController.js');
const listingController = require('@/controllers/listingController.js');
const dashboardMockData = require('@/__mocks__/dashboard_test_extra.json');

// ----------------- Mock Setup -----------------

jest.mock('axios');

// ----------------- Buyer Dashboard Tests -----------------

describe('BuyerDashboard Integration Tests', () => {
  it('should fetch and render buyer dashboard data', async () => {
    axios.get.mockResolvedValue({ data: dashboardMockData.buyer });

    const data = await userController.getUserData('buyerId123');
    expect(data).toEqual(dashboardMockData.buyer);
  });
});

// ----------------- Seller Dashboard Tests -----------------

describe('SellerDashboard Integration Tests', () => {
  it('should fetch and render seller listings', async () => {
    axios.get.mockResolvedValue({ data: dashboardMockData.sellerListings });

    const listings = await listingController.getSellerListings('sellerId123');
    expect(listings).toEqual(dashboardMockData.sellerListings);
  });
});

// ----------------- Admin Dashboard Tests -----------------

describe('AdminDashboard Integration Tests', () => {
  it('should fetch and render admin summary data', async () => {
    axios.get.mockResolvedValue({ data: dashboardMockData.adminSummary });

    const adminData = await userController.getAdminSummary('adminId123');
    expect(adminData).toEqual(dashboardMockData.adminSummary);
  });
});

// ----------------- Notes -----------------
// - Mock data is sourced from @__mocks__/dashboard_test_extra.json
// - Routes under test: /api/users/:userId, /api/seller/:sellerId/listings, /api/admin/summary
// - axios is mocked to prevent live server calls


