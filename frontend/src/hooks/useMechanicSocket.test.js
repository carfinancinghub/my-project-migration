// File: useMechanicSocket.test.js
// Path: frontend/src/hooks/useMechanicSocket.test.js
import { renderHook } from '@testing-library/react-hooks';
import useMechanicSocket from '@hooks/useMechanicSocket';

jest.mock('socket.io-client', () => () => ({
  on: (event, cb) => {
    if (event === 'task_assigned:mech123') {
      cb({ id: 'T123', vehicleId: 'V456', priority: 'High', timestamp: '2025-05-05T13:00:00Z' });
    }
  },
  emit: jest.fn()
}));

test('receives mocked task via WebSocket', () => {
  const { result } = renderHook(() => useMechanicSocket('mech123'));
  expect(result.current[0]).toMatchObject({ id: 'T123', vehicleId: 'V456', priority: 'High' });
});
