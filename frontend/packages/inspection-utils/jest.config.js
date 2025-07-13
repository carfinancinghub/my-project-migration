/*
 * File: jest.config.js
 * Path: C:\\CFH\\frontend\\packages\\inspection-utils\\jest.config.js
 * Purpose: Jest configuration for inspection-utils
 * Author: Cod1 Team
 * Crown Certified: Yes
 * Batch ID: Inspection-061325
 */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@cfh/inspection-utils(.*)$': '<rootDir>$1'
  }
};