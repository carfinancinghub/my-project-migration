/**
 * @file EscrowTransaction.test.tsx
 * @path C:\CFH\frontend\src\tests\escrow\EscrowTransaction.test.tsx
 * @author Mini Team
 * @created 2025-06-10 [0823]
 * @purpose Tests the EscrowTransaction component for UI reliability and accessibility.
 * @user_impact Ensures a smooth and accessible user experience for transaction management.
 * @version 1.0.0
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EscrowTransaction } from '../../components/escrow/EscrowTransaction';
import { escrowApi } from '../../services/escrowApi';

jest.mock('../../services/escrowApi');
const mockedEscrowApi = escrowApi as jest.Mocked<typeof escrowApi>;

describe('<EscrowTransaction />', () => {
    beforeEach(() => {
        const mockTransaction = { _id: 'txn_123', parties: [], conditions: [] };
        mockedEscrowApi.getTransaction.mockResolvedValue({ data: mockTransaction });
        jest.clearAllMocks();
    });

    it('shows a validation error if propose condition form is submitted with a short description', async () => {
        render(<EscrowTransaction transactionId="txn_123" />);
        const proposeButton = await screen.findByRole('button', { name: /Propose a new custom condition/i });
        await userEvent.click(proposeButton);
        const conditionInput = screen.getByLabelText(/Condition Description/i);
        const submitButton = screen.getByRole('button', { name: /Submit Proposal/i });
        await userEvent.type(conditionInput, 'Too short');
        await userEvent.click(submitButton);
        expect(mockedEscrowApi.proposeCondition).not.toHaveBeenCalled();
        const errorMessage = await screen.findByRole('alert');
        expect(errorMessage).toHaveTextContent('Description must be at least 50 characters long.');
    });

    it('displays a "not found" error message when API returns 404', async () => {
        mockedEscrowApi.getTransaction.mockRejectedValue({ response: { data: { message: 'Not Found' } } });
        render(<EscrowTransaction transactionId="invalid-id" />);
        const errorMessage = await screen.findByRole('alert');
        expect(errorMessage).toHaveTextContent('Not Found');
    });
});
