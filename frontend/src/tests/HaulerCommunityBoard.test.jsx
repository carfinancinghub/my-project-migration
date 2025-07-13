// File: HaulerCommunityBoard.test.jsx
// Path: frontend/src/tests/HaulerCommunityBoard.test.jsx
// Author: Cod3 (05051024)

import React from 'react';
import { render, screen } from '@testing-library/react';
import HaulerCommunityBoard from '@components/hauler/HaulerCommunityBoard';

test('renders community board component', () => {
  render(<HaulerCommunityBoard />);
  expect(screen.getByText(/Community Board/i)).toBeInTheDocument();
});
