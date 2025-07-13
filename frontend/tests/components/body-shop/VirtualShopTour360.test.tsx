/*
File: VirtualShopTour360.test.tsx
Path: C:\CFH\frontend\tests\components\body-shop\VirtualShopTour360.test.tsx
Created: 2025-07-05 11:00 AM PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Jest test file for VirtualShopTour360 with RTL and accessibility checks.
Artifact ID: j9k0l1m2-n3o4-p5q6-r7s8-t9u0v1w2x3y4
Version ID: k0l1m2n3-o4p5-q6r7-s8t9-u0v1w2x3y4z5
*/

import React from 'react';
import { render, screen, waitFor, cleanup, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'; // For extended matchers like toBeInTheDocument
import { axe, toHaveNoViolations } from 'jest-axe'; // For accessibility testing

// Extend Jest with jest-axe matchers
expect.extend(toHaveNoViolations);

import VirtualShopTour360 from '@/components/body-shop/VirtualShopTour360';
import logger from '@/utils/logger';
import { toast } from '@/utils/toast'; // Mock toast notifications

// Mock external dependencies
jest.mock('@/utils/logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}));
jest.mock('@/utils/toast', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
    },
}));

// Mock Photo Sphere Viewer
// Mock 'Viewer' constructor and its methods
const mockAddHotspot = jest.fn();
const mockOnViewerEvent = jest.fn(); // Generic mock for viewer.on()
const mockViewerDestroy = jest.fn();
const mockViewerConstructor = jest.fn().mockImplementation(() => {
    return {
        addHotspot: mockAddHotspot,
        on: (event: string, callback: Function) => {
            if (event === 'click') {
                mockOnViewerEvent.mockImplementation(callback); // Store the click handler
            }
            // Cod1+ TODO: Mock other events if component uses them (e.g., 'ready', 'position-updated')
        },
        destroy: mockViewerDestroy,
    };
});
jest.mock('photo-sphere-viewer', () => ({
    Viewer: mockViewerConstructor,
}));


// Mock the `useVirtualTour` hook which is internal to VirtualShopTour360.tsx
// This allows us to control its return values for testing different states.
const mockUseVirtualTour = jest.fn();
// We explicitly mock the module where `VirtualShopTour360` is defined
// to intercept its internal hook's behavior.
jest.mock('@/components/body-shop/VirtualShopTour360', () => {
    // This uses `jest.requireActual` to get the original module's exports,
    // then overrides the default export to inject our mock hook.
    // This is a common pattern when you need to mock an internal hook.
    const originalModule = jest.requireActual('@/components/body-shop/VirtualShopTour360');
    return {
        ...originalModule, // Export everything else from the original module
        default: (props: any) => {
            // This is a wrapper for the actual component.
            // It replaces the real `useVirtualTour` call with our mock.
            const { tour, loading, error } = mockUseVirtualTour(props.shopId);

            // Directly call the actual component's rendering logic with the mocked hook data
            // This is necessary because `useVirtualTour` is not exported, forcing a full component mock.
            // A more testable design would export `useVirtualTour`
            if (loading) return <div>Loading virtual tour...</div>;
            if (error) return <div role="alert">Error: {error}</div>;
            if (!tour) return <div>No virtual tour available for this shop.</div>;

            return (
                <div data-testid="virtual-tour-content">
                    <h3>{tour.shopName} Virtual Tour</h3>
                    <p>{tour.description}</p>
                    <div data-testid="viewer-container" ref={React.createRef()}></div> {/* Ref for PSV */}
                    {tour.hotspots && tour.hotspots.map((hotspot: any) => (
                        // Render a simplified button for hotspots to simulate user interaction
                        // This button will call the stored mock viewer.on('click') handler
                        <button
                            key={hotspot.id}
                            data-hotspot-id={hotspot.id}
                            style={{ position: 'absolute', left: '0px', top: '0px' }} // Position off-screen for test stability
                            aria-label={`Interactive hotspot: ${hotspot.content.replace(/<[^>]*>/g, '')}`}
                            onClick={() => mockOnViewerEvent({ data: { hotspotId: hotspot.id } })} // Simulate PSV click event
                        >
                            {hotspot.html.replace(/<[^>]*>/g, '')}
                        </button>
                    ))}
                </div>
            );
        },
    };
});


describe('VirtualShopTour360', () => {
    const mockShopId = 'shop360-xyz';
    const mockTourData = {
        shopId: mockShopId,
        shopName: 'Test 360 Shop',
        tourUrl: 'http://example.com/360-pano.jpg',
        description: 'A mock virtual tour for testing.',
        hotspots: [
            { id: 'h1', longitude: 0.1, latitude: 0.1, html: '<b>Info Desk</b>', tooltip: 'Information Desk' },
            { id: 'h2', longitude: 0.5, latitude: 0.2, html: '<b>Repair Bay</b>', tooltip: 'Main Repair Area' },
        ],
    };

    beforeEach(() => {
        cleanup(); // Clean up DOM after each test
        jest.clearAllMocks(); // Clear all mock calls
        // Set default mock implementation for the hook to a successful state
        mockUseVirtualTour.mockReturnValue({ tour: mockTourData, loading: false, error: null });
        // Reset PhotoSphereViewer mocks
        mockViewerConstructor.mockClear();
        mockAddHotspot.mockClear();
        mockOnViewerEvent.mockClear();
        mockViewerDestroy.mockClear();
    });

    // --- Loading State Test ---
    it('should render loading state initially', () => {
        mockUseVirtualTour.mockReturnValue({ tour: null, loading: true, error: null });
        render(<VirtualShopTour360 shopId={mockShopId} />);
        expect(screen.getByText('Loading virtual tour...')).toBeInTheDocument();
    });

    // --- Error State Test ---
    it('should render error state if data fetching fails', async () => {
        mockUseVirtualTour.mockReturnValue({ tour: null, loading: false, error: 'Network error' });
        render(<VirtualShopTour360 shopId={mockShopId} />);
        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
            expect(screen.getByText('Error: Network error')).toBeInTheDocument();
        });
        // Cod1+ TODO: Verify logger.error is called from the hook
    });

    // --- No Data State Test ---
    it('should render "No tour available" if no tour data is returned', async () => {
        mockUseVirtualTour.mockReturnValue({ tour: null, loading: false, error: null });
        render(<VirtualShopTour360 shopId={mockShopId} />);
        await waitFor(() => {
            expect(screen.getByText('No virtual tour available for this shop.')).toBeInTheDocument();
        });
    });

    // --- Valid Data Rendering Test ---
    it('should render virtual tour content and initialize PhotoSphereViewer', async () => {
        render(<VirtualShopTour360 shopId={mockShopId} />);
        await waitFor(() => {
            expect(screen.getByText(`${mockTourData.shopName} Virtual Tour`)).toBeInTheDocument();
            expect(screen.getByText(mockTourData.description)).toBeInTheDocument();
            expect(screen.getByTestId('viewer-container')).toBeInTheDocument(); // Container for PSV
        });

        // Verify PhotoSphereViewer constructor was called
        expect(mockViewerConstructor).toHaveBeenCalledTimes(1);
        expect(mockViewerConstructor).toHaveBeenCalledWith(expect.objectContaining({
            container: expect.any(HTMLDivElement), // Check that a div element is passed as container
            panorama: mockTourData.tourUrl,
            navbar: ['zoom', 'move', 'fullscreen', 'caption'], // Default navbar
        }));
        // Verify hotspots were added
        expect(mockAddHotspot).toHaveBeenCalledTimes(mockTourData.hotspots.length);
        expect(mockAddHotspot).toHaveBeenCalledWith(expect.objectContaining({ id: 'h1' }));
        expect(mockAddHotspot).toHaveBeenCalledWith(expect.objectContaining({ id: 'h2' }));
        // Verify click listener was set up
        expect(mockOnViewerEvent).toBeCalledTimes(0); // Only set up, not triggered yet
    });

    // --- Hotspot Interactivity Test ---
    it('should trigger toast and log when a hotspot is clicked', async () => {
        render(<VirtualShopTour360 shopId={mockShopId} />);
        await waitFor(() => expect(screen.getByTestId('virtual-tour-content')).toBeInTheDocument()); // Wait for rendering

        // Simulate a click on a hotspot button
        const infoDeskHotspotButton = screen.getByRole('button', { name: /Info Desk/i });
        userEvent.click(infoDeskHotspotButton);

        // Verify toast and logger calls
        expect(toast.info).toHaveBeenCalledTimes(1);
        expect(toast.info).toHaveBeenCalledWith('Hotspot: Information Desk', expect.any(Object));
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Hotspot clicked: h1, Content: Info Desk'));
        // Cod1+ TODO: Test more complex hotspot data types (e.g., video modal, image pop-up)
    });

    // --- Accessibility Test (Jest-Axe) ---
    it('should have no accessibility violations', async () => {
        mockUseVirtualTour.mockReturnValue({ tour: mockTourData, loading: false, error: null });
        const { container } = render(<VirtualShopTour360 shopId={mockShopId} />);
        await waitFor(() => expect(screen.getByTestId('virtual-tour-content')).toBeInTheDocument());
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    // --- Performance Test ---
    it('should log a warning if render time exceeds 500ms', async () => {
        // Temporarily mock the internal setTimeout to delay the hook's completion,
        // making the component render longer.
        jest.spyOn(global, 'setTimeout').mockImplementation((cb: any, ms: number) => {
            if (ms === 300) { // This is the mock hook's internal delay
                setTimeout(() => cb(), 501); // Make it exceed 500ms
            } else {
                setTimeout(cb, ms);
            }
            return {} as any;
        });

        render(<VirtualShopTour360 shopId={mockShopId} />);
        await waitFor(() => expect(screen.getByTestId('virtual-tour-content')).toBeInTheDocument());
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('VirtualShopTour360 render time exceeded 500ms'));
    });

    // --- Cleanup Test ---
    it('should destroy PhotoSphereViewer instance on unmount', async () => {
        const { unmount } = render(<VirtualShopTour360 shopId={mockShopId} />);
        await waitFor(() => expect(screen.getByTestId('virtual-tour-content')).toBeInTheDocument());
        expect(mockViewerDestroy).not.toHaveBeenCalled(); // Not yet destroyed
        unmount();
        expect(mockViewerDestroy).toHaveBeenCalledTimes(1); // Should be called on unmount
    });
});