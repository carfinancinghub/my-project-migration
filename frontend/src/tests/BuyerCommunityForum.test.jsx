/**
 * File: BuyerCommunityForum.test.jsx
 * Path: frontend/src/tests/BuyerCommunityForum.test.jsx
 * Author: Cod4 (05042319)
 * Purpose: Unit tests for BuyerCommunityForum.jsx covering free and premium tier functionality
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BuyerCommunityForum from '@components/buyer/BuyerCommunityForum';
import * as MultiLanguageSupport from '@components/common/MultiLanguageSupport';
import * as PremiumFeatureModule from '@components/common/PremiumFeature';

jest.mock('@components/common/MultiLanguageSupport', () => ({
    useLanguage: () => ({
        getTranslation: (key) => key,
        currentLanguage: 'en'
    })
}));

describe('BuyerCommunityForum Component', () => {
    it('renders forum title and initial threads', async () => {
        render(<BuyerCommunityForum />);

        expect(await screen.findByText('forum.title')).toBeInTheDocument();
        expect(screen.getByText('Best Cars for First-Time Buyers')).toBeInTheDocument();
        expect(screen.getByText('Review of 2021 Honda Civic')).toBeInTheDocument();
    });

    it('opens new thread modal and creates a thread', async () => {
        render(<BuyerCommunityForum />);

        fireEvent.click(screen.getByText('forum.createThread'));
        expect(await screen.findByLabelText('Create New Thread')).toBeInTheDocument();

        fireEvent.change(screen.getByPlaceholderText('forum.threadTitlePlaceholder'), {
            target: { value: 'Test Thread Title' }
        });
        fireEvent.change(screen.getByPlaceholderText('forum.threadContentPlaceholder'), {
            target: { value: 'Test thread content goes here.' }
        });
        fireEvent.click(screen.getByText('forum.postThread'));

        await waitFor(() => {
            expect(screen.getByText('Test Thread Title')).toBeInTheDocument();
        });
    });

    it('gates poll creation behind premium feature - hidden if false', () => {
        jest.spyOn(PremiumFeatureModule, 'PremiumFeature').mockImplementation(({ children }) => null);
        render(<BuyerCommunityForum />);
        expect(screen.queryByText('forum.createPoll')).not.toBeInTheDocument();
    });

    it('shows poll creation button if PremiumFeature enabled', () => {
        jest.spyOn(PremiumFeatureModule, 'PremiumFeature').mockImplementation(({ children }) => <>{children}</>);
        render(<BuyerCommunityForum />);
        expect(screen.getByText('forum.createPoll')).toBeInTheDocument();
    });
});
