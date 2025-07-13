/*
File: RepairJourneyShare.tsx
Path: C:\CFH\frontend\src\components\body-shop\RepairJourneyShare.tsx
Created: 2025-07-05 11:25 AM PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: React component for sharing a repair journey with a generated link.
Artifact ID: l1m2n3o4-p5q6-r7s8-t9u0-v1w2x3y4z5a6
Version ID: m2n3o4p5-q6r7-s8t9-u0v1-w2x3y4z5a6b7
*/

import React, { useState, useCallback, useEffect } from 'react';
import logger from '@/utils/logger'; // Centralized logging utility
import { toast } from '@/utils/toast'; // Assuming a toast notification utility
// Cod1+ TODO: Import a social share utility if needed for more complex sharing (e.g., direct to Facebook/Twitter API)
// import { socialShareUtility } from '@/utils/socialShareUtility';

// Define component props
interface RepairJourneyShareProps {
    jobId: string; // The ID of the job whose journey is being shared
    vehicleMake: string; // For better share text
    vehicleModel: string; // For better share text
    userTier?: 'free' | 'standard' | 'premium' | 'wowplus'; // For potential tiered sharing options
}

const RepairJourneyShare: React.FC<RepairJourneyShareProps> = ({ jobId, vehicleMake, vehicleModel, userTier }) => {
    // Generate the shareable link. In a real app, this might come from a backend API.
    const [shareLink, setShareLink] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const generateLink = async () => {
            setLoading(true);
            // Simulate API call to generate a unique, trackable share link
            await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for effect
            const generatedUrl = `https://cfh.com/journey/${jobId}`; // Mock URL
            setShareLink(generatedUrl);
            setLoading(false);
            logger.info(`RepairJourneyShare: Generated share link for job ${jobId}: ${generatedUrl}`);
        };
        generateLink();
    }, [jobId]);


    // Handle Copy to Clipboard
    const handleCopyLink = useCallback(async () => {
        const startTime = performance.now(); // CQS: Performance monitoring
        try {
            // Use document.execCommand('copy') for broader browser compatibility in iframes
            const tempInput = document.createElement('input');
            tempInput.value = shareLink;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);

            toast.success('Repair journey link copied to clipboard!', { position: 'top-right' });
            logger.info(`RepairJourneyShare: Link copied to clipboard for job ${jobId}`);
            // CQS: Audit logging for share action
            logger.info(`AUDIT: User copied share link for job ${jobId}`);
        } catch (err) {
            toast.error('Failed to copy link. Please try manually.', { position: 'top-right' });
            logger.error(`RepairJourneyShare: Failed to copy link for job ${jobId}:`, err);
        } finally {
            const endTime = performance.now();
            const actionTimeMs = endTime - startTime;
            if (actionTimeMs > 500) { // CQS: <500ms response
                logger.warn(`RepairJourneyShare: Copy link action exceeded 500ms: ${actionTimeMs.toFixed(2)}ms`);
            }
        }
    }, [shareLink, jobId]);

    // Handle Email Sharing
    const handleEmailShare = useCallback(() => {
        const startTime = performance.now(); // CQS: Performance monitoring
        const subject = encodeURIComponent(`Check out the repair journey for my ${vehicleMake} ${vehicleModel}!`);
        const body = encodeURIComponent(`Hi,\n\nI wanted to share the repair journey of my ${vehicleMake} ${vehicleModel} on Rivers Auction Platform. You can track its progress here:\n\n${shareLink}\n\nBest,\n[Your Name]`);
        const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
        
        window.location.href = mailtoLink; // Opens default email client

        toast.info('Opening email client...', { position: 'top-right' });
        logger.info(`RepairJourneyShare: Email share initiated for job ${jobId}`);
        // CQS: Audit logging for share action
        logger.info(`AUDIT: User initiated email share for job ${jobId}`);

        const endTime = performance.now();
        const actionTimeMs = endTime - startTime;
        if (actionTimeMs > 500) { // CQS: <500ms response
            logger.warn(`RepairJourneyShare: Email share action exceeded 500ms: ${actionTimeMs.toFixed(2)}ms`);
        }
    }, [shareLink, jobId, vehicleMake, vehicleModel]);

    // Cod1+ TODO: Add social media sharing buttons (e.g., Twitter, Facebook) if `socialShareUtility` is integrated.
    // These would typically open new windows with pre-filled share intents.

    // CQS: Accessibility (WCAG 2.1 AA with ARIA labels)
    return (
        <div className="repair-journey-share p-4 bg-white rounded-lg shadow-md" aria-label={`Share repair journey for job ${jobId}`}>
            <h2 className="text-xl font-bold mb-3">Share Your Car's Repair Journey</h2>
            <p className="text-sm text-gray-700 mb-4">
                Share a unique link with friends, family, or insurance to keep them updated on your {vehicleMake} {vehicleModel}'s repair progress.
            </p>

            {loading ? (
                <div className="text-center p-4">Generating share link...</div>
            ) : (
                <>
                    <div className="mb-4">
                        <label htmlFor="shareLink" className="block text-sm font-medium text-gray-700 mb-1">Shareable Link</label>
                        <input
                            type="text"
                            id="shareLink"
                            value={shareLink}
                            readOnly
                            className="input input-bordered w-full bg-gray-100 cursor-text"
                            aria-readonly="true"
                            aria-label={`Shareable link for job ${jobId}`}
                        />
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleCopyLink}
                            className="btn bg-blue-600 text-white hover:bg-blue-700"
                            aria-label="Copy repair journey link to clipboard"
                        >
                            Copy Link
                        </button>
                        <button
                            onClick={handleEmailShare}
                            className="btn bg-green-600 text-white hover:bg-green-700"
                            aria-label="Share repair journey link via email"
                        >
                            Share via Email
                        </button>
                        {/* Cod1+ TODO: Add buttons for other social media platforms (e.g., Twitter, Facebook) */}
                        {userTier === 'premium' && (
                            <>
                                <button className="btn bg-blue-400 text-white hover:bg-blue-500" aria-label="Share on Twitter">Share on Twitter</button>
                                <button className="btn bg-blue-800 text-white hover:bg-blue-900" aria-label="Share on Facebook">Share on Facebook</button>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default RepairJourneyShare;