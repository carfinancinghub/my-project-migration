
/*
File: LiveAuctionStream.test.tsx
Path: C:\CFH\frontend\src\tests\components\auctions\LiveAuctionStream.test.tsx
Created: 2025-07-03 14:30 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Jest tests for LiveAuctionStream component with ≥95% coverage including accessibility and WebSocket mocks.
export const liveStreamService = new LiveStreamService();
Purpose: Jest tests for LiveAuctionStream.tsx with ≥95% coverage, including accessibility (jest-axe) and WebSocket mocks.
Artifact ID: x5y6z7a8-b9c0-d1e2-f3g4-h5i6j7k8l9m0
Version ID: y6z7a8b9-c0d1-e2f3-g4h5-i6j7k8l9m0n1
*/

import React from 'react';
import { render, screen, waitFor, cleanup, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe'; // For accessibility testing
import LiveAuctionStream from '@/components/auction/LiveAuctionStream';
import logger from '@/utils/logger';
import { toast } from '@/utils/toast';

// Extend Jest with jest-axe matchers
expect.extend(toHaveNoViolations);

// Mock logger and toast
jest.mock('@/utils/logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}));
jest.mock('@/utils/toast', () => ({
    toast: {
        error: jest.fn(),
        info: jest.fn(),
    },
}));

// Mock WebSocket for testing real-time features
// This is a simplified mock. For complex WebSocket testing, libraries like 'mock-socket' are better.
class MockWebSocket {
    static instances: MockWebSocket[] = [];
    onmessage: ((event: MessageEvent) => void) | null = null;
    onopen: (() => void) | null = null;
    onerror: (() => void) | null = null;
    onclose: (() => void) | null = null;
    readyState: number = 0; // 0: CONNECTING, 1: OPEN, 2: CLOSING, 3: CLOSED
    url: string;

    constructor(url: string) {
        this.url = url;
        MockWebSocket.instances.push(this);
        setTimeout(() => {
            this.readyState = 1; // Simulate connection opening
            if (this.onopen) this.onopen();
        }, 10);
    }

    send = jest.fn();
    close = jest.fn(() => {
        this.readyState = 3;
        if (this.onclose) this.onclose();
    });

    // Helper to simulate incoming messages
    _triggerMessage(data: any) {
        if (this.onmessage) {
            this.onmessage({ data: JSON.stringify(data) } as MessageEvent);
        }
    }
    _triggerError() {
        if (this.onerror) this.onerror();
    }
}
// Replace global WebSocket with our mock
const originalWebSocket = global.WebSocket;
beforeAll(() => {
    global.WebSocket = MockWebSocket as any;
});
afterAll(() => {
    global.WebSocket = originalWebSocket;
});


describe('LiveAuctionStream', () => {
    const mockAuctionId = 'auction123';
    const mockStreamUrl = 'http://mockstream.com/live/auction123.mpd'; // .mpd for DASH

    beforeEach(() => {
        cleanup(); // Ensure a clean DOM for each test
        jest.clearAllMocks();
        MockWebSocket.instances = []; // Clear WebSocket instances
        // Mock HTMLMediaElement.prototype.play() to prevent actual video playback errors in tests
        jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
        jest.spyOn(window.HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
    });

    // --- Basic Rendering & Loading ---
    it('renders loading state initially', () => {
        render(<LiveAuctionStream auctionId={mockAuctionId} userTier="free" streamUrl={mockStreamUrl} />);
        expect(screen.getByText('Loading live stream...')).toBeInTheDocument();
    });

    it('renders video player after loading', async () => {
        render(<LiveAuctionStream auctionId={mockAuctionId} userTier="free" streamUrl={mockStreamUrl} />);
        await waitFor(() => {
            expect(screen.queryByText('Loading live stream...')).not.toBeInTheDocument();
            expect(screen.getByLabelText(Video player for live auction ${mockAuctionId})).toBeInTheDocument();
        });
        expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();
    });

    it('displays "No live stream available" if streamUrl is missing', async () => {
        render(<LiveAuctionStream auctionId={mockAuctionId} userTier="free" />);
        await waitFor(() => {
            expect(screen.queryByText('Loading live stream...')).not.toBeInTheDocument();
            expect(screen.getByText('No live stream available for this auction yet.')).toBeInTheDocument();
        });
    });

    // --- Error Handling ---
    it('displays error message if video fails to load', async () => {
        render(<LiveAuctionStream auctionId={mockAuctionId} userTier="free" streamUrl={mockStreamUrl} />);
        
        // Simulate video element error
        await act(async () => {
            const videoElement = screen.getByLabelText(Video player for live auction ${mockAuctionId}) as HTMLVideoElement;
            // Create a mock error object
            Object.defineProperty(videoElement, 'error', {
                value: { message: 'Network error' },
                configurable: true,
            });
            videoElement.dispatchEvent(new Event('error'));
        });

        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
            expect(screen.getByText('Failed to load stream: Network error.')).toBeInTheDocument();
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('LiveAuctionStream: Video error'), expect.any(Object));
            expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Stream error for auction123: Network error.'));
        });
    });

    it('displays error if autoplay is blocked', async () => {
        jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.reject(new Error('Autoplay blocked')));

        render(<LiveAuctionStream auctionId={mockAuctionId} userTier="free" streamUrl={mockStreamUrl} />);
        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
            expect(screen.getByText('Autoplay blocked. Please click to play.')).toBeInTheDocument();
        });
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to autoplay video'), expect.any(Error));
    });

    it('displays HTTPS warning in production if not secure', async () => {
        const originalProtocol = window.location.protocol;
        const originalNodeEnv = process.env.NODE_ENV;
        Object.defineProperty(window.location, 'protocol', { value: 'http:', writable: true });
        process.env.NODE_ENV = 'production';

        render(<LiveAuctionStream auctionId={mockAuctionId} userTier="free" streamUrl={mockStreamUrl} />);
        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
            expect(screen.getByText('Insecure connection detected. Live streaming requires HTTPS.')).toBeInTheDocument();
        });
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Frontend attempting to load LiveAuctionStream over insecure HTTP in production.'));

        Object.defineProperty(window.location, 'protocol', { value: originalProtocol, writable: true });
        process.env.NODE_ENV = originalNodeEnv;
    });

    // --- Wow++ Tier Features (Audience Count) ---
    it('displays audience count for Wow++ tier', async () => {
        render(<LiveAuctionStream auctionId={mockAuctionId} userTier="wowplus" streamUrl={mockStreamUrl} />);

        await waitFor(() => {
            expect(screen.getByText('LIVE')).toBeInTheDocument(); // Stream is live
            expect(screen.getByText(/Audience:/i)).toBeInTheDocument();
        });

        // Simulate a few audience updates
        await act(async () => {
            // MockWebSocket's constructor has a setTimeout, so we need to wait for it to open
            await new Promise(resolve => setTimeout(resolve, 50)); // Give it time to connect
            const wsInstance = MockWebSocket.instances[0];
            wsInstance._triggerMessage({ type: 'audienceUpdate', payload: { count: 150 } });
        });

        await waitFor(() => {
            expect(screen.getByText('Audience: 150')).toBeInTheDocument();
        });
    });

    it('does not display audience count for lower tiers', async () => {
        render(<LiveAuctionStream auctionId={mockAuctionId} userTier="premium" streamUrl={mockStreamUrl} />);
        await waitFor(() => {
            expect(screen.getByText('LIVE')).toBeInTheDocument();
        });
        expect(screen.queryByText(/Audience:/i)).not.toBeInTheDocument();
    });

    // --- Accessibility Tests (Jest-Axe) ---
    it('should have no accessibility violations for Free tier', async () => {
        const { container } = render(<LiveAuctionStream auctionId={mockAuctionId} userTier="free" streamUrl={mockStreamUrl} />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations for Wow++ tier', async () => {
        const { container } = render(<LiveAuctionStream auctionId={mockAuctionId} userTier="wowplus" streamUrl={mockStreamUrl} interactiveOverlaysEnabled={true} />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
