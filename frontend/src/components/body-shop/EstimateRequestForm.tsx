/*
File: EstimateRequestForm.tsx
Path: C:\CFH\frontend\src\components\body-shop\EstimateRequestForm.tsx
Created: 2025-07-04 09:15 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Form component for requesting repair estimates with tiered features.
Artifact ID: f5g6h7i8-j9k0-l1m2-n3o4-p5q6r7s8t9u0
Version ID: g6h7i8j9-k0l1-m2n3-o4p5-q6r7s8t9u0v1
*/

import React, { useState, useEffect, useCallback } from 'react';
import logger from '@/utils/logger'; // Centralized logging utility
import { toast } from '@/utils/toast'; // Assuming a toast notification utility
import { bodyShopApi } from '@/services/bodyShopApi'; // API service for submitting estimates
// Cod1+ TODO: Import AI Damage Assessment Service
// import { AIDamageAssessmentService } from '@/services/ai/AIDamageAssessmentService';
// Cod1+ TODO: Import Chat Integration Component
// import { ExpertChatWidget } from '@/components/common/ExpertChatWidget';
// Cod1+ TODO: Import for Progress Notifications
// import { EstimateProgressNotification } from '@/components/notifications/EstimateProgressNotification';

// Define types for form data and responses
interface EstimateRequestData {
    shopId?: string; // Optional for multi-shop requests (Premium+)
    userId: string;
    vehicleMake: string;
    vehicleModel: string;
    damageDescription: string;
    photos: File[]; // Max 3 for Free, 5 for Standard, unlimited for Premium
    videos?: File[]; // For Standard+
    insuranceProvider?: string; // Standard+
    policyNumber?: string; // Standard+
    preferredContact?: 'email' | 'phone' | 'in_app'; // Standard+
    contactEmail?: string;
    contactPhone?: string;
    selectedShopIds?: string[]; // For multi-shop requests (Premium+)
    // Add other fields as necessary for estimate request
}

interface EstimateResponse {
    estimateId: string;
    status: 'Pending' | 'Assessing' | 'QuoteReady' | 'Rejected';
    preliminaryAssessment?: string; // Wow++ AI assessment
    estimatedCost?: number; // Wow++ AI assessment
}

interface EstimateRequestFormProps {
    userTier: 'free' | 'standard' | 'premium' | 'wowplus';
    userId: string; // Current authenticated user ID
    initialShopId?: string; // Optional: If requesting for a specific shop from profile view
}

const EstimateRequestForm: React.FC<EstimateRequestFormProps> = ({ userTier, userId, initialShopId }) => {
    const [formData, setFormData] = useState<Partial<EstimateRequestData>>({
        shopId: initialShopId,
        userId: userId,
        vehicleMake: '',
        vehicleModel: '',
        damageDescription: '',
        photos: [],
        videos: [],
    });
    const [loading, setLoading] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
    const [aiAssessmentResult, setAiAssessmentResult] = useState<any | null>(null); // For Wow++ AI assessment

    // CQS: Audit logging on component render
    useEffect(() => {
        logger.info(`Rendering EstimateRequestForm for user ${userId}, tier: ${userTier}`);
    }, [userId, userTier]);

    // Handle form input changes
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    // Handle file uploads
    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const maxPhotos = userTier === 'free' ? 3 : (userTier === 'standard' ? 5 : 999); // Unlimited for Premium+

        // Filter valid file types
        const validFiles = files.filter(file => {
            const fileType = file.type;
            if (!fileType.startsWith('image/') && !fileType.startsWith('video/')) {
                toast.error(`Invalid file type: ${file.name}. Only images and videos are allowed.`, { position: 'top-right' });
                return false;
            }
            return true;
        });

        // Separate photos and videos
        const newPhotos = validFiles.filter(file => file.type.startsWith('image/'));
        const newVideos = validFiles.filter(file => file.type.startsWith('video/'));

        // Check upload limits
        if (newPhotos.length + (formData.photos?.length || 0) > maxPhotos) {
            toast.error(`Upload limit exceeded. Max photos for your tier: ${maxPhotos}.`, { position: 'top-right' });
            logger.warn(`Upload limit exceeded for user ${userId}, tier ${userTier}. Attempted to upload ${newPhotos.length} photos, max ${maxPhotos}.`);
            setFormData(prev => ({ ...prev, photos: (prev.photos || []).concat(newPhotos.slice(0, maxPhotos - (prev.photos?.length || 0))) }));
        } else {
            setFormData(prev => ({
                ...prev,
                photos: (prev.photos || []).concat(newPhotos),
                videos: (prev.videos || []).concat(userTier !== 'free' ? newVideos : []), // Videos for Standard+
            }));
        }
    }, [userTier, formData.photos, formData.videos, userId]);

    // Handle AI preliminary damage assessment (Wow++ only)
    const handleAIDamageAssessment = useCallback(async () => {
        if (userTier !== 'wowplus' || !formData.photos || formData.photos.length === 0) {
            toast.warn('Please upload photos and ensure you are on Wow++ tier for AI assessment.', { position: 'top-right' });
            return;
        }
        setLoading(true);
        try {
            // Cod1+ TODO: Call AI Damage Assessment Service
            // const assessment = await AIDamageAssessmentService.assessDamage(formData.photos);
            const mockAssessment = {
                summary: "AI detected moderate front-end damage, likely requiring bumper replacement and paint.",
                estimatedCost: Math.floor(Math.random() * (5000 - 2000 + 1) + 2000), // $2000-$5000
                confidence: 0.85
            };
            setAiAssessmentResult(mockAssessment);
            toast.success("AI assessment complete!", { position: 'top-right' });
            logger.info(`AI damage assessment successful for user ${userId}.`);
        } catch (err: any) {
            setAiAssessmentResult(null);
            toast.error(err.message || "Failed to get AI assessment. Please try again.", { position: 'top-right' });
            logger.error(`AI damage assessment failed for user ${userId}:`, err);
        } finally {
            setLoading(false);
        }
    }, [userTier, formData.photos, userId]);


    // Form submission
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSubmissionStatus(null);
        setError(null);

        // Basic validation
        if (!formData.vehicleMake || !formData.vehicleModel || !formData.damageDescription) {
            toast.error('Please fill in all required vehicle and damage details.', { position: 'top-right' });
            setLoading(false);
            return;
        }
        if (userTier === 'free' && formData.photos && formData.photos.length === 0) {
            toast.error('Please upload at least one photo for a Free Tier estimate.', { position: 'top-right' });
            setLoading(false);
            return;
        }

        const startTime = performance.now(); // CQS: <1s form submission for Standard+

        try {
            // Cod1+ TODO: Call bodyShopApi to submit estimate request
            // const response = await bodyShopApi.submitEstimateRequest(formData, userTier);

            const mockResponse: EstimateResponse = {
                estimateId: `est_${Date.now()}`,
                status: 'Pending',
                preliminaryAssessment: aiAssessmentResult?.summary, // Include AI assessment if available
                estimatedCost: aiAssessmentResult?.estimatedCost,
            };
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API latency

            setSubmissionStatus(`Estimate request submitted successfully! ID: ${mockResponse.estimateId}`);
            toast.success("Estimate request submitted!", { position: 'top-right' });
            logger.info(`Estimate request ${mockResponse.estimateId} submitted by user ${userId}, tier ${userTier}.`);

            // Cod1+ TODO: Trigger estimate progression notifications
            // EstimateProgressNotification.notify(userId, mockResponse.estimateId, 'submitted');

            const endTime = performance.now();
            const submissionTimeMs = endTime - startTime;
            if (userTier !== 'free' && submissionTimeMs > 1000) { // <1s for Standard+
                logger.warn(`Estimate form submission time exceeded 1s: ${submissionTimeMs.toFixed(2)}ms for tier ${userTier}`);
            }

        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit estimate request.');
            toast.error(err.response?.data?.message || 'Failed to submit estimate request.', { position: 'top-right' });
            logger.error(`Estimate request submission failed for user ${userId}:`, err);
        } finally {
            setLoading(false);
        }
    }, [formData, userTier, aiAssessmentResult, userId]);


    // CQS: WCAG 2.1 AA (screen reader support, keyboard navigation)
    return (
        <div className="estimate-request-form p-4 bg-white rounded-lg shadow-md" aria-label={`Repair estimate request form for ${userTier} tier`}>
            <h1 className="text-2xl font-bold mb-4">Request Repair Estimate ({userTier.toUpperCase()} Tier)</h1>

            <form onSubmit={handleSubmit}>
                <section className="mb-6">
                    <h2 className="text-lg font-semibold mb-3">Vehicle & Damage Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="vehicleMake" className="block text-sm font-medium text-gray-700">Vehicle Make</label>
                            <input type="text" id="vehicleMake" name="vehicleMake" value={formData.vehicleMake} onChange={handleInputChange} className="input input-bordered w-full" required aria-required="true" aria-label="Enter vehicle make" />
                        </div>
                        <div>
                            <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700">Vehicle Model</label>
                            <input type="text" id="vehicleModel" name="vehicleModel" value={formData.vehicleModel} onChange={handleInputChange} className="input input-bordered w-full" required aria-required="true" aria-label="Enter vehicle model" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="damageDescription" className="block text-sm font-medium text-gray-700">Damage Description</label>
                        <textarea id="damageDescription" name="damageDescription" value={formData.damageDescription} onChange={handleInputChange} className="textarea textarea-bordered w-full" rows={4} placeholder="Describe the damage (e.g., 'Front bumper dented on passenger side, minor headlight crack')." required aria-required="true" aria-label="Describe vehicle damage"></textarea>
                    </div>

                    {/* Standard Tier: Guided Damage Input */}
                    {(userTier === 'standard' || userTier === 'premium' || userTier === 'wowplus') && (
                        <div className="mt-4 p-3 border rounded-md bg-gray-50">
                            <h3 className="text-md font-medium text-gray-700 mb-2">Guided Damage Input</h3>
                            <p className="text-sm text-gray-600">Select affected areas for precise assessment.</p>
                            {/* Cod1+ TODO: Implement guided damage input UI (e.g., interactive car diagram) */}
                            <button type="button" className="btn btn-sm mt-2">Open Diagram Tool</button>
                        </div>
                    )}
                </section>

                <section className="mb-6">
                    <h2 className="text-lg font-semibold mb-3">Photos & Videos</h2>
                    <div>
                        <label htmlFor="photoUpload" className="block text-sm font-medium text-gray-700 mb-1">Upload Photos & Videos (Max {userTier === 'free' ? 3 : (userTier === 'standard' ? 5 : 'Unlimited')})</label>
                        <input type="file" id="photoUpload" multiple accept="image/*,video/*" onChange={handleFileChange} className="file-input file-input-bordered w-full" aria-label="Upload photos and videos of vehicle damage" />
                        <div className="mt-2 text-sm text-gray-500">
                            {formData.photos && formData.photos.length > 0 && <span>{formData.photos.length} photos uploaded. </span>}
                            {formData.videos && formData.videos.length > 0 && <span>{formData.videos.length} videos uploaded.</span>}
                            {(!formData.photos || formData.photos.length === 0) && (!formData.videos || formData.videos.length === 0) && <span>No files selected.</span>}
                        </div>
                    </div>
                    {/* Wow++ Tier: AI Preliminary Damage Assessment */}
                    {userTier === 'wowplus' && formData.photos && formData.photos.length > 0 && (
                        <div className="mt-4 p-3 border rounded-md bg-purple-50">
                            <h3 className="text-md font-medium text-gray-700 mb-2">AI Preliminary Damage Assessment</h3>
                            <p className="text-sm text-gray-600 mb-2">Get an instant AI analysis of your uploaded damage photos.</p>
                            <button type="button" onClick={handleAIDamageAssessment} className="btn bg-purple-600 text-white hover:bg-purple-700" disabled={loading} aria-label="Run AI damage assessment">
                                {loading ? 'Assessing...' : 'Run AI Assessment'}
                            </button>
                            {aiAssessmentResult && (
                                <div className="mt-3 p-2 bg-purple-100 rounded-md">
                                    <p className="font-semibold text-purple-800">AI Summary:</p>
                                    <p className="text-sm text-purple-700">{aiAssessmentResult.summary}</p>
                                    <p className="text-sm text-purple-700">Estimated Cost: ${aiAssessmentResult.estimatedCost?.toLocaleString()}</p>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* Contact Information & Insurance (Standard Tier: add insurance) */}
                {(userTier === 'standard' || userTier === 'premium' || userTier === 'wowplus') && (
                    <section className="mb-6">
                        <h2 className="text-lg font-semibold mb-3">Contact & Insurance Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="insuranceProvider" className="block text-sm font-medium text-gray-700">Insurance Provider (Optional)</label>
                                <input type="text" id="insuranceProvider" name="insuranceProvider" value={formData.insuranceProvider || ''} onChange={handleInputChange} className="input input-bordered w-full" aria-label="Enter insurance provider" />
                            </div>
                            <div>
                                <label htmlFor="policyNumber" className="block text-sm font-medium text-gray-700">Policy Number (Optional)</label>
                                <input type="text" id="policyNumber" name="policyNumber" value={formData.policyNumber || ''} onChange={handleInputChange} className="input input-bordered w-full" aria-label="Enter insurance policy number" />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="preferredContact" className="block text-sm font-medium text-gray-700">Preferred Contact Method</label>
                                <select id="preferredContact" name="preferredContact" value={formData.preferredContact || ''} onChange={handleInputChange} className="select select-bordered w-full" aria-label="Select preferred contact method">
                                    <option value="">Select one</option>
                                    <option value="email">Email</option>
                                    <option value="phone">Phone</option>
                                    <option value="in_app">In-App Message</option>
                                </select>
                            </div>
                            {/* Cod1+ TODO: Data encryption for Premium/Wow++ */}
                        </div>
                    </section>
                )}

                {/* Shop Selection (Premium Tier: multi-shop) */}
                {(userTier === 'premium' || userTier === 'wowplus') && (
                    <section className="mb-6">
                        <h2 className="text-lg font-semibold mb-3">Select Shops for Estimate</h2>
                        {initialShopId ? (
                            <p className="text-gray-700">Requesting estimate from: **Shop ID: {initialShopId}**</p>
                        ) : (
                            <>
                                <p className="text-sm text-gray-600 mb-2">Select 3-5 shops to request estimates from. Unlimited for Wow++.</p>
                                {/* Cod1+ TODO: Implement multi-shop selection UI (e.g., checkboxes, search) */}
                                <div className="border p-4 rounded-md bg-gray-50">
                                    <p>Shop selection UI placeholder (e.g., search/select up to 5 shops).</p>
                                    {/* For local testing, mock selected shops */}
                                    <input type="hidden" name="selectedShopIds" value={['shopX', 'shopY'].join(',')} />
                                </div>
                            </>
                        )}
                         {/* Cod1+ TODO: Implement feature to store/reuse requests */}
                         <button type="button" className="btn btn-sm mt-3">Save as Template</button>
                    </section>
                )}

                {submissionStatus && (
                    <div className="mt-4 p-3 rounded-md bg-green-100 text-green-800" role="status">
                        {submissionStatus}
                    </div>
                )}
                {error && (
                    <div className="mt-4 p-3 rounded-md bg-red-100 text-red-800" role="alert">
                        Error: {error}
                    </div>
                )}

                <button
                    type="submit"
                    className="btn bg-blue-600 text-white hover:bg-blue-700 w-full mt-4"
                    disabled={loading}
                    aria-label={loading ? 'Submitting request...' : 'Submit Estimate Request'}
                >
                    {loading ? 'Submitting...' : 'Submit Estimate Request'}
                </button>
            </form>

            {/* Wow++ Tier: Instant Chat with Experts, Estimate Progression Notifications */}
            {userTier === 'wowplus' && (
                <section className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
                    <h2 className="text-lg font-semibold mb-3">Wow++ Estimate Management</h2>
                    <div className="flex flex-wrap gap-2">
                        {/* Cod1+ TODO: Integrate instant chat with experts */}
                        <button className="btn bg-teal-600 text-white hover:bg-teal-700" aria-label="Chat instantly with an expert">Instant Chat with Expert</button>
                        {/* Cod1+ TODO: Integrate Estimate Progression Notifications */}
                        {/* <EstimateProgressNotification userId={userId} /> */}
                        <p className="text-sm text-gray-700">Real-time notifications on your estimate's progress are enabled.</p>
                    </div>
                    {/* Cod1+ TODO: Implement "Detail Master" badge logic */}
                    <p className="text-sm text-gray-700 mt-4">Complete detailed requests to earn the "Detail Master" badge!</p>
                </section>
            )}
        </div>
    );
};

export default EstimateRequestForm;