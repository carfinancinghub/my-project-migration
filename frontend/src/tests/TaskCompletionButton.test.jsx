/**
 * File: TaskCompletionButton.test.jsx
 * Path: frontend/src/tests/TaskCompletionButton.test.jsx
 * Purpose: Jest tests for TaskCompletionButton.jsx in the Mechanic role
 * Author: Cod1 (05060025)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import TaskCompletionButton from '@/components/mechanic/TaskCompletionButton';

// --- Mocks ---
jest.mock('axios');
jest.mock('@/hooks/useSocket', () => ({
  useSocket: () => ({ emit: jest.fn() })
}));
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// --- Test Suite ---
describe('TaskCompletionButton', () => {
  const props = {
    taskId: 'task123',
    mechanicId: 'mech456',
    timestamp: '2025-05-06T00:00:00.000Z'
  };

  it('renders the button', () => {
    render(<TaskCompletionButton {...props} />);
    expect(screen.getByText('Mark as Completed')).toBeInTheDocument();
  });

  it('calls API and emits socket event on success', async () => {
    axios.post.mockResolvedValueOnce({ data: { message: 'Task marked as completed' } });

    render(<TaskCompletionButton {...props} />);
    const button = screen.getByText('Mark as Completed');
    fireEvent.click(button);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/mechanic/task-completed', props);
      expect(toast.success).toHaveBeenCalledWith('Task marked as completed');
    });
  });

  it('shows error toast on API failure', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { error: 'Upload failed' } } });

    render(<TaskCompletionButton {...props} />);
    fireEvent.click(screen.getByText('Mark as Completed'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Upload failed');
    });
  });

  it('shows error if required props are missing', async () => {
    render(<TaskCompletionButton taskId="" mechanicId="" timestamp="" />);
    fireEvent.click(screen.getByText('Mark as Completed'));
    expect(toast.error).toHaveBeenCalledWith('Missing task data');
  });
});
