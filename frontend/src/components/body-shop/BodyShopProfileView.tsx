/*
File: BodyShopProfileView.tsx
Path: C:\CFH\frontend\src\components\body-shop\BodyShopProfileView.tsx
Created: 2025-07-04 01:55 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Component for viewing body shop profiles with tiered features.
Artifact ID: e4f5g6h7-i8j9-k0l1-m2n3-o4p5q6r7s8t9
Version ID: f5g6h7i8-j9k0-l1m2-n3o4-p5q6r7s8t9u0
*/

import React, { useState, useEffect, useCallback } from 'react';
import logger from '@/utils/logger'; // Centralized logging utility
import { toast } from '@/utils/toast'; // Assuming a toast notification utility
import { bodyShopApi } from '@/services/bodyShopApi'; // API service for fetching body shop data
// Cod1+ TODO: Import for Map integration (e.g., MapComponent)
// import { MapComponent } from '@/components/common/MapComponent';
// Cod1+ TODO: Import for AR Showcase
// import { ARCertificationViewer } from '@/components/ar/ARCertificationViewer';
// Cod1+ TODO: Import for AI Review Summarizer
// import { AIReviewSummarizer } from '@/services/ai/AIReviewSummarizer';
// Cod1+ TODO: Import for Real-time Shop Cam
// import { ShopCamStream } from '@/components/body-shop/ShopCamStream';
// Cod1+ TODO: Import for Repair History Gallery
// import { RepairHistoryGallery } from '@/components/body-shop/RepairHistoryGallery';

// Define types for Body Shop Profile data
interface Review {
    id: string;
    text: string;
    rating: number;
    author: string;
    timestamp: string;
}

interface Certification {
    name: string;
    issuer: string;
    imageUrl?: string;
}

interface ShopProfile {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    email: string;
    website?: string;
    services: string[]; // Basic services for Free, detailed for Standard
    photos: string[]; // 3-5 for Free, extensive for Premium
    rating: number;
    totalReviews: number;
    reviews: Review[]; // Last 3 for Free, full for Premium
    certifications?: Certification[]; // Premium
    insurancePartnerships?: string[]; // Premium
    isCFHVerified?: boolean; // Premium badge
    virtualTourUrl?: string; // Premium
    arCertificationModelUrl?: string; // Wow++
    aiReviewSummary?: string; // Wow++
    liveCamUrl?: string; // Wow++
    repairHistoryGalleryIds?: string[]; // Wow++
}

interface BodyShopProfileViewProps {
    shopId: string;
    userTier: 'free' | 'standard' | 'premium' | 'wowplus';
    userId?: string; // For audit logging, personalized interactions
}

const BodyShopProfileView: React.FC<BodyShopProfileViewProps> = ({ shopId, userTier, userId }) => {
    const [profile, setProfile] = useState<ShopProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // CQS: HTTPS check (client-side, for informational purposes)
    useEffect(() => {
        if (window.location.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
            setError("Insecure connection detected. Please use HTTPS for secure profile viewing.");
            logger.warn("Frontend attempting to load BodyShopProfileView over insecure HTTP in production.");
        }
    }, []);

    // Data fetching with retry logic and tier-specific data retrieval
    const fetchProfile = useCallback(async (id: string, currentTier: string, retryCount = 0) => {
        const MAX_RETRIES = 3;
        const RETRY_DELAY_MS = 1000;

        setLoading(true);
        setError(null);
        setProfile(null); // Clear previous profile

        try {
            const startTime = performance.now(); // CQS: <2s load for Free, <1s for Wow++

            // Cod1+ TODO: Call bodyShopApi to fetch shop profile based on tier
            // const response = await bodyShopApi.getShopProfile(id, currentTier);

            // --- Mock Data Generation based on Tier ---
            const baseProfile: ShopProfile = {
                id: shopId,
                name: 'Elite Auto Repair',
                address: '123 Main St', city: 'Rocklin', state: 'CA', zipCode: '95677',
                phone: '(916) 555-1234', email: 'info@eliteauto.com', website: 'https://eliteauto.com',
                services: ['Collision Repair', 'Paint Jobs', 'Dent Removal', 'Frame Straightening', 'Detailing'],
                photos: [
                    'https://placehold.co/600x400/008080/FFFFFF?text=Shop+Exterior',
                    'https://placehold.co/600x400/0000FF/FFFFFF?text=Repair+Bay+1',
                    'https://placehold.co/600x400/800080/FFFFFF?text=Paint+Booth',
                    'https://placehold.co/600x400/FF0000/FFFFFF?text=Waiting+Area',
                    'https://placehold.co/600x400/00FF00/FFFFFF?text=Shop+Interior+2',
                    'https://placehold.co/600x400/000000/FFFFFF?text=Certificates',
                    'https://placehold.co/600x400/C0C0C0/000000?text=Team',
                ],
                rating: 4.8, totalReviews: 125,
                reviews: [
                    { id: 'rev1', text: 'Excellent service, highly recommend!', rating: 5, author: 'Alice B.', timestamp: '2025-06-28T10:00:00Z' },
                    { id: 'rev2', text: 'Quick and professional, my car looks new.', rating: 5, author: 'Bob C.', timestamp: '2025-06-25T11:00:00Z' },
                    { id: 'rev3', text: 'Good work, but took a bit longer than expected.', rating: 4, author: 'Charlie D.', timestamp: '2025-06-20T12:00:00Z' },
                    { id: 'rev4', text: 'Friendly staff, fair prices.', rating: 4, author: 'Diana E.', timestamp: '2025-06-18T13:00:00Z' },
                    { id: 'rev5', text: 'Had a minor issue after repair, but they fixed it quickly.', rating: 3, author: 'Frank G.', timestamp: '2025-06-10T14:00:00Z' },
                ],
                certifications: [{ name: 'ASE Certified', issuer: 'ASE', imageUrl: 'https://placehold.co/100x50?text=ASE' }],
                insurancePartnerships: ['Geico', 'State Farm', 'Progressive'],
                isCFHVerified: true,
                virtualTourUrl: 'https://mock-virtual-tour.com/eliteauto',
                arCertificationModelUrl: 'https://mock-ar-model.com/ase_badge.glb',
                aiReviewSummary: 'AI Summary: Reviews highlight excellent service, professionalism, and quick repairs, with minor mentions of timing and post-repair adjustments.',
                liveCamUrl: 'https://mock-live-cam.com/eliteauto',
                repairHistoryGalleryIds: ['repair1', 'repair2', 'repair3'],
            };

            let currentProfile: ShopProfile = { ...baseProfile };

            if (currentTier === 'free') {
                currentProfile.services = currentProfile.services.slice(0, 3); // Limited services
                currentProfile.photos = currentProfile.photos.slice(0, 5); // 3-5 photos
                currentProfile.reviews = currentProfile.reviews.slice(0, 3); // Last 3 reviews
                // Remove premium/wow++ fields
                delete currentProfile.certifications;
                delete currentProfile.insurancePartnerships;
                delete currentProfile.isCFHVerified;
                delete currentProfile.virtualTourUrl;
                delete currentProfile.arCertificationModelUrl;
                delete currentProfile.aiReviewSummary;
                delete currentProfile.liveCamUrl;
                delete currentProfile.repairHistoryGalleryIds;
            } else if (currentTier === 'standard') {
                currentProfile.photos = currentProfile.photos.slice(0, 10); // More photos
                currentProfile.reviews = currentProfile.reviews.slice(0, 5); // More reviews
                // Remove premium/wow++ fields
                delete currentProfile.certifications;
                delete currentProfile.insurancePartnerships;
                delete currentProfile.isCFHVerified;
                delete currentProfile.virtualTourUrl;
                delete currentProfile.arCertificationModelUrl;
                delete currentProfile.aiReviewSummary;
                delete currentProfile.liveCamUrl;
                delete currentProfile.repairHistoryGalleryIds;
            } else if (currentTier === 'premium') {
                // Premium gets full reviews, extensive media, certifications, etc.
                // Remove Wow++ fields
                delete currentProfile.arCertificationModelUrl;
                delete currentProfile.aiReviewSummary;
                delete currentProfile.liveCamUrl;
                delete currentProfile.repairHistoryGalleryIds;
            }
            // Wow++ gets all fields

            // Simulate API call latency
            await new Promise(resolve => setTimeout(resolve, 300));

            setProfile(currentProfile);

            const endTime = performance.now();
            const loadTimeMs = endTime - startTime;
            const threshold = userTier === 'wowplus' ? 1000 : 2000; // CQS: <1s for Wow++, <2s for Free
            if (loadTimeMs > threshold) {
                logger.warn(`BodyShopProfileView load time exceeded ${threshold}ms: ${loadTimeMs.toFixed(2)}ms for shop ${shopId}, tier ${currentTier}`);
            }

        } catch (err: any) {
            logger.error(`Failed to load body shop profile for ${shopId} (attempt ${retryCount + 1}/${MAX_RETRIES}):`, err);
            if (retryCount < MAX_RETRIES - 1) {
                setError(`Failed to load profile. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
                setTimeout(() => fetchProfile(id, currentTier, retryCount + 1), RETRY_DELAY_MS);
            } else {
                setError(err.response?.data?.message || 'Failed to load body shop profile after multiple attempts.');
                toast.error(err.response?.data?.message || 'Failed to load body shop profile.', { position: 'top-right' });
            }
        } finally {
            if (retryCount >= MAX_RETRIES - 1 || error === null) {
                setLoading(false);
            }
        }
    }, [shopId, userTier]);

    useEffect(() => {
        if (shopId) {
            fetchProfile(shopId, userTier);
        } else {
            setLoading(false);
            setError("Body shop ID is required to view profile.");
        }
    }, [shopId, userTier, fetchProfile]);


    if (loading) return <div className="text-center p-4" aria-live="polite">Loading shop profile...</div>;
    if (error) return <div className="text-center p-4 text-red-600" role="alert">Error: {error}</div>;
    if (!profile) return <div className="text-center p-4 text-gray-500">No body shop profile data available.</div>;

    // CQS: Accessibility (WCAG 2.1 AA with keyboard navigation, ARIA)
    return (
        <div className="body-shop-profile-view p-4 bg-white rounded-lg shadow-md" aria-label={`Profile view for ${profile.name}`}>
            <h1 className="text-2xl font-bold mb-4" aria-level={1}>{profile.name}</h1>
            <p className="text-sm text-gray-600 mb-2" aria-label={`Address: ${profile.address}, ${profile.city}, ${profile.state} ${profile.zipCode}`}>{profile.address}, {profile.city}, {profile.state} {profile.zipCode}</p>
            <p className="text-md font-bold text-yellow-500 mb-4" aria-label={`Rating: ${profile.rating} out of 5 stars from ${profile.totalReviews} reviews`}>Rating: {profile.rating} ({profile.totalReviews} reviews)</p>

            {/* Contact Info (Free Tier and above) */}
            <section className="mb-6">
                <h2 className="text-lg font-semibold mb-2" aria-level={2}>Contact Information</h2>
                <p>Phone: <a href={`tel:${profile.phone}`} className="text-blue-600 hover:underline" aria-label={`Call ${profile.name} at ${profile.phone}`}>{profile.phone}</a></p>
                <p>Email: <a href={`mailto:${profile.email}`} className="text-blue-600 hover:underline" aria-label={`Email ${profile.name} at ${profile.email}`}>{profile.email}</a></p>
                {profile.website && <p>Website: <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" aria-label={`Visit website for ${profile.name}`}>{profile.website}</a></p>}
            </section>

            {/* Services Offered (Free Tier: basic, Standard: detailed) */}
            <section className="mb-6">
                <h2 className="text-lg font-semibold mb-2" aria-level={2}>Services Offered</h2>
                <ul className="list-disc pl-5" aria-label="List of services offered">
                    {profile.services.map((service, index) => (
                        <li key={index} className="text-sm text-gray-700" role="listitem">{service}</li>
                    ))}
                </ul>
            </section>

            {/* Photo Gallery (Free Tier: 3-5, Standard: more, Premium: extensive) */}
            <section className="mb-6">
                <h2 className="text-lg font-semibold mb-2" aria-level={2}>Photo Gallery</h2>
                {profile.photos && profile.photos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" role="list" aria-label="Body shop photo gallery">
                        {profile.photos.map((photo, index) => (
                            <img key={index} src={photo} alt={`Gallery image ${index + 1} of ${profile.name}`} className="w-full h-32 object-cover rounded-md shadow-sm" role="listitem" />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No photos available.</p>
                )}
            </section>

            {/* Customer Reviews (Free Tier: last 3, Premium: full) */}
            <section className="mb-6">
                <h2 className="text-lg font-semibold mb-2" aria-level={2}>Customer Reviews</h2>
                {profile.reviews && profile.reviews.length > 0 ? (
                    <div role="list" aria-label="Customer reviews">
                        {profile.reviews.map((review, index) => (
                            <div key={review.id} className="border-b last:border-b-0 py-3" role="listitem">
                                <p className="font-medium">{review.author} - {review.rating} Stars</p>
                                <p className="text-sm text-gray-700">{review.text}</p>
                                <p className="text-xs text-gray-500 mt-1">{new Date(review.timestamp).toLocaleDateString()}</p>
                            </div>
                        ))}
                        {userTier === 'free' && profile.totalReviews > 3 && (
                            <p className="text-sm text-gray-500 mt-2">...and {profile.totalReviews - 3} more reviews. <a href="#" className="text-blue-600 hover:underline" aria-label="View all reviews">View All Reviews</a></p>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-500">No reviews found.</p>
                )}
                {/* Cod1+ TODO: Handle "No reviews found" (Free) */}
            </section>

            {/* Standard Tier: Map Integration, Online Booking */}
            {(userTier === 'standard' || userTier === 'premium' || userTier === 'wowplus') && (
                <section className="mb-6">
                    <h2 className="text-lg font-semibold mb-2" aria-level={2}>Location & Booking</h2>
                    <div className="map-container h-64 bg-gray-200 rounded-md flex items-center justify-center mb-4">
                        {/* Cod1+ TODO: Integrate MapComponent */}
                        {/* <MapComponent address={`${profile.address}, ${profile.city}, ${profile.state}`} /> */}
                        <p className="text-gray-500">Map View Placeholder</p>
                    </div>
                    {/* Cod1+ TODO: Integrate online booking functionality */}
                    <button className="btn bg-green-600 text-white hover:bg-green-700" aria-label="Book appointment online">Book Online</button>
                </section>
            )}

            {/* Premium Tier: Certifications, Insurance Partnerships, Direct Messaging, Virtual Tour, "Verified by CFH" Badge */}
            {(userTier === 'premium' || userTier === 'wowplus') && (
                <section className="mb-6">
                    <h2 className="text-lg font-semibold mb-2" aria-level={2}>Premium Features</h2>
                    {profile.certifications && profile.certifications.length > 0 && (
                        <div className="mb-3">
                            <h3 className="text-md font-medium text-gray-700 mb-1">Certifications</h3>
                            <ul className="list-disc pl-5" aria-label="List of certifications">
                                {profile.certifications.map((cert, index) => (
                                    <li key={index} className="text-sm text-gray-700" role="listitem">
                                        {cert.name} {cert.issuer && `(${cert.issuer})`}
                                        {cert.imageUrl && <img src={cert.imageUrl} alt={`${cert.name} badge`} className="inline-block h-6 ml-2" />}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {profile.insurancePartnerships && profile.insurancePartnerships.length > 0 && (
                        <div className="mb-3">
                            <h3 className="text-md font-medium text-gray-700 mb-1">Insurance Partnerships</h3>
                            <p className="text-sm text-gray-700" aria-label={`Insurance partners: ${profile.insurancePartnerships.join(', ')}`}>
                                {profile.insurancePartnerships.join(', ')}
                            </p>
                        </div>
                    )}
                    {profile.isCFHVerified && (
                        <p className="text-green-600 font-bold mb-3" aria-label="This shop is verified by CFH">
                            👑 Verified by CFH
                        </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                        {/* Cod1+ TODO: Integrate Direct Messaging */}
                        <button className="btn btn-sm">Direct Message Shop</button>
                        {profile.virtualTourUrl && (
                            <button className="btn btn-sm" aria-label="Take a virtual tour of the shop">Virtual Tour</button>
                        )}
                    </div>
                </section>
            )}

            {/* Wow++ Tier: AR Certification Showcase, AI Review Summarizer, Real-time Shop Cam, Repair History Gallery */}
            {userTier === 'wowplus' && (
                <section className="mb-6">
                    <h2 className="text-lg font-semibold mb-2" aria-level={2}>Wow++ Exclusive Features</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {profile.arCertificationModelUrl && (
                            // Cod1+ TODO: Integrate ARCertificationViewer
                            // <ARCertificationViewer modelUrl={profile.arCertificationModelUrl} />
                            <button className="btn btn-sm bg-purple-600 text-white hover:bg-purple-700" aria-label="View certifications in Augmented Reality">AR Certifications</button>
                        )}
                        {profile.liveCamUrl && (
                            // Cod1+ TODO: Integrate ShopCamStream
                            // <ShopCamStream streamUrl={profile.liveCamUrl} />
                            <button className="btn btn-sm bg-red-600 text-white hover:bg-red-700" aria-label="View live shop camera feed">Live Shop Cam</button>
                        )}
                        {profile.repairHistoryGalleryIds && profile.repairHistoryGalleryIds.length > 0 && (
                            // Cod1+ TODO: Integrate RepairHistoryGallery
                            // <RepairHistoryGallery galleryIds={profile.repairHistoryGalleryIds} />
                            <button className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700" aria-label="Browse repair history gallery">Repair History Gallery</button>
                        )}
                    </div>
                    {profile.aiReviewSummary && (
                        <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200" aria-label="AI-generated review summary">
                            <h3 className="font-semibold text-indigo-800 mb-1">AI Review Summary</h3>
                            <p className="text-sm text-indigo-700">{profile.aiReviewSummary}</p>
                            {/* Cod1+ TODO: Link to AIReviewSummarizer service */}
                        </div>
                    )}
                    <p className="text-sm text-gray-700 mt-4">
                        <span className="font-semibold">"Shop Explorer" Badge:</span> Earned by users who extensively utilize these Wow++ features.
                    </p>
                </section>
            )}
        </div>
    );
};

export default BodyShopProfileView;