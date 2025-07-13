/*
File: BodyShopDiscoveryPage.tsx
Path: C:\CFH\frontend\src\components\body-shop\BodyShopDiscoveryPage.tsx
Created: 2025-07-04 01:45 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Component for discovering body shops with tiered features.
Artifact ID: c2d3e4f5-g6h7-8i9j-0k1l-2m3n4o5p6q7r
Version ID: d3e4f5g6-h7i8-9j0k-1l2m-3n4o5p6q7r8s
*/

import React, { useState, useEffect, useCallback } from 'react';
import logger from '@/utils/logger'; // Centralized logging utility
import { toast } from '@/utils/toast'; // Assuming a toast notification utility
import { bodyShopApi } from '@/services/bodyShopApi'; // API service for fetching body shop data
// Cod1+ TODO: Import AI matching service if backend-side, or a client-side AI utility
// import { AIBodyShopMatcher } from '@/services/ai/AIBodyShopMatcher';
// Cod1+ TODO: Import MapComponent for map view
// import { MapComponent } from '@/components/common/MapComponent';
// Cod1+ TODO: Import ComparisonTable for interactive comparison
// import { ComparisonTable } from '@/components/common/ComparisonTable';

// Define types for Body Shop data
interface Review {
    id: string;
    text: string;
    rating: number;
    author: string;
}

interface BodyShop {
    id: string;
    name: string;
    address: string;
    city: string;
    zipCode: string;
    rating: number;
    totalReviews: number;
    reviews?: Review[]; // Last 3 for Free, more for Standard+
    primaryPhoto?: string; // For Standard+
    services?: string[]; // e.g., 'collision repair', 'paint jobs', 'dent removal'
    priceRange?: string; // e.g., '$', '$$', '$$$'
    certifications?: string[]; // Premium
    insuranceAccepted?: string[]; // Premium
    amenities?: string[]; // Premium
    isAvailable?: boolean; // Real-time availability
    aiMatchScore?: number; // Wow++ AI matching score
}

interface BodyShopDiscoveryPageProps {
    userTier: 'free' | 'standard' | 'premium' | 'wowplus';
    userId?: string; // For personalized features, saved searches
}

const BodyShopDiscoveryPage: React.FC<BodyShopDiscoveryPageProps> = ({ userTier, userId }) => {
    const [shops, setShops] = useState<BodyShop[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchLocation, setSearchLocation] = useState<string>(''); // For ZIP code/city
    const [serviceFilter, setServiceFilter] = useState<string>(''); // For Standard Tier
    const [minRatingFilter, setMinRatingFilter] = useState<number>(0); // For Free Tier
    const [priceRangeFilter, setPriceRangeFilter] = useState<string>(''); // For Standard Tier
    const [advancedFilters, setAdvancedFilters] = useState<any>({}); // For Premium Tier (certifications, insurance, amenities)
    const [damagePhotos, setDamagePhotos] = useState<File[]>([]); // For Wow++ AI matching

    // CQS: HTTPS check (client-side, for informational purposes) and CSP
    useEffect(() => {
        if (window.location.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
            setError("Insecure connection detected. Please use HTTPS for secure features.");
            logger.warn("Frontend attempting to load BodyShopDiscoveryPage over insecure HTTP in production.");
        }
        // CQS: CSP for Premium/Wow++ - This is typically set in HTTP headers, not client-side React.
        // Cod1+ TODO: Verify CSP headers are correctly configured for premium/Wow++ features like external map tiles, AI endpoints.
        if ((userTier === 'premium' || userTier === 'wowplus') && process.env.NODE_ENV === 'production' && !document.head.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
             logger.warn("Content Security Policy meta tag not found in production for Premium/Wow++ tier page. Review CSP headers.");
        }
    }, [userTier]);


    // Data fetching function with retry logic for API failures
    const fetchShops = useCallback(async (location: string, filters: any = {}, retryCount = 0) => {
        const MAX_RETRIES = 3;
        const RETRY_DELAY_MS = 1000;

        setLoading(true);
        setError(null);
        setShops([]); // Clear previous results

        try {
            const startTime = performance.now(); // CQS: <2s load for Free, <1s for Wow++

            // Cod1+ TODO: Integrate with actual bodyShopApi.getShops call
            // const response = await bodyShopApi.getShops(location, filters, userTier, damagePhotos);

            // --- Mock Data Generation based on Tier ---
            let mockShopData: BodyShop[] = [
                { id: 's1', name: 'Elite Auto Repair', address: '123 Main St', city: 'Rocklin', zipCode: '95677', rating: 4.8, totalReviews: 120, reviews: [{ id: 'r1', text: 'Great service!', rating: 5, author: 'UserA' }, { id: 'r4', text: 'Professional job.', rating: 4, author: 'UserD' }, { id: 'r5', text: 'Quick and easy.', rating: 5, author: 'UserE' }, { id: 'r6', text: 'A bit pricey.', rating: 3, author: 'UserF' }], services: ['Collision Repair', 'Paint Jobs'], primaryPhoto: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=EliteShop', priceRange: '$$', certifications: ['ASE Certified'], insuranceAccepted: ['Geico', 'Progressive'], amenities: ['Waiting Room', 'Free WiFi'], isAvailable: true, aiMatchScore: 0.95 },
                { id: 's2', name: 'Quick Fix Body Shop', address: '456 Oak Ave', city: 'Roseville', zipCode: '95747', rating: 4.5, totalReviews: 85, reviews: [{ id: 'r2', text: 'Fast and reliable.', rating: 4, author: 'UserB' }], services: ['Dent Removal', 'Paint Jobs'], primaryPhoto: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=QuickFix', priceRange: '$', certifications: [], insuranceAccepted: ['State Farm'], amenities: ['Loaner Cars'], isAvailable: false, aiMatchScore: 0.88 },
                { id: 's3', name: 'Precision Auto Works', address: '789 Pine Ln', city: 'Sacramento', zipCode: '95814', rating: 4.9, totalReviews: 200, reviews: [{ id: 'r3', text: 'Excellent job on my car.', rating: 5, author: 'UserC' }], services: ['Collision Repair', 'Frame Straightening'], primaryPhoto: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Precision', priceRange: '$$$', certifications: ['I-CAR Gold', 'OEM Certified'], insuranceAccepted: ['Progressive', 'Allstate'], amenities: ['Shuttle Service', 'Online Tracking'], isAvailable: true, aiMatchScore: 0.98 },
                { id: 's4', name: 'Urban Auto Solutions', address: '101 City Rd', city: 'Sacramento', zipCode: '95818', rating: 4.2, totalReviews: 50, reviews: [{ id: 'r7', text: 'Good, but slow.', rating: 3, author: 'UserG' }], services: ['Collision Repair', 'Detailing'], primaryPhoto: 'https://via.placeholder.com/150/FFFF00/000000?text=UrbanAuto', priceRange: '$$', certifications: ['ASE'], insuranceAccepted: ['Geico'], amenities: ['Night Drop'], isAvailable: true, aiMatchScore: 0.85 },
            ];

            // Apply tier-specific data visibility
            mockShopData = mockShopData.map(shop => {
                const newShop = { ...shop };
                if (userTier === 'free') {
                    newShop.reviews = newShop.reviews?.slice(0, 3); // Max 3 reviews for Free
                    delete newShop.services;
                    delete newShop.primaryPhoto;
                    delete newShop.priceRange;
                    delete newShop.certifications;
                    delete newShop.insuranceAccepted;
                    delete newShop.amenities;
                    delete newShop.isAvailable;
                    delete newShop.aiMatchScore;
                } else if (userTier === 'standard') {
                    newShop.reviews = newShop.reviews?.slice(0, 5); // More reviews for Standard
                    delete newShop.certifications;
                    delete newShop.insuranceAccepted;
                    delete newShop.amenities;
                    delete newShop.isAvailable;
                    delete newShop.aiMatchScore;
                } else if (userTier === 'premium') {
                    // Premium sees all but AI score
                    delete newShop.aiMatchScore;
                }
                return newShop;
            });

            // Apply Basic Filters (Free Tier and above)
            if (minRatingFilter > 0) {
                mockShopData = mockShopData.filter(shop => shop.rating >= minRatingFilter);
            }

            // Apply Standard Tier Filters
            if (userTier !== 'free') {
                if (serviceFilter) {
                    mockShopData = mockShopData.filter(shop => shop.services?.includes(serviceFilter));
                }
                if (priceRangeFilter) {
                    mockShopData = mockShopData.filter(shop => shop.priceRange === priceRangeFilter);
                }
            }
            // Apply Premium Tier Advanced Filters
            if (userTier === 'premium' || userTier === 'wowplus') {
                if (advancedFilters.certification) {
                    mockShopData = mockShopData.filter(shop => shop.certifications?.some(cert => cert.toLowerCase().includes(advancedFilters.certification.toLowerCase())));
                }
                if (advancedFilters.insurance) {
                    mockShopData = mockShopData.filter(shop => shop.insuranceAccepted?.some(ins => ins.toLowerCase().includes(advancedFilters.insurance.toLowerCase())));
                }
                if (advancedFilters.amenities) {
                    mockShopData = mockShopData.filter(shop => shop.amenities?.some(amenity => amenity.toLowerCase().includes(advancedFilters.amenities.toLowerCase())));
                }
            }


            // Apply Wow++ AI matching (if damage photos uploaded)
            if (userTier === 'wowplus' && damagePhotos.length > 0) {
                // Cod1+ TODO: Call AI matching service (e.g., AIBodyShopMatcher.matchByDamagePhotos)
                // This would likely be an async call to a backend AI service
                // const aiMatchedShops = await AIBodyShopMatcher.matchByDamagePhotos(damagePhotos, mockShopData);
                // mockShopData = aiMatchedShops.sort((a, b) => (b.aiMatchScore || 0) - (a.aiMatchScore || 0)); // Sort by AI score
                
                // Simulate AI processing and sorting by AI score for mock data
                mockShopData.sort((a, b) => (b.aiMatchScore || 0) - (a.aiMatchScore || 0));
                toast.info("AI matching complete! Results sorted by relevance.", { position: 'top-right' });
                logger.info(`AI matching performed for user ${userId} with ${damagePhotos.length} photos.`);
            }


            // Simulate API call latency (can vary by tier for testing purposes)
            const simulatedLatency = userTier === 'wowplus' ? 300 : (userTier === 'free' ? 800 : 500); // Faster for Wow++
            await new Promise(resolve => setTimeout(resolve, simulatedLatency));

            setShops(mockShopData);

            const endTime = performance.now();
            const loadTimeMs = endTime - startTime;
            const threshold = userTier === 'wowplus' ? 1000 : 2000; // CQS: <1s for Wow++, <2s for Free
            if (loadTimeMs > threshold) {
                logger.warn(`BodyShopDiscoveryPage load time exceeded ${threshold}ms: ${loadTimeMs.toFixed(2)}ms for tier ${userTier}`);
            }

        } catch (err: any) {
            logger.error(`Failed to load body shops for tier ${userTier} (attempt ${retryCount + 1}/${MAX_RETRIES}):`, err);
            if (retryCount < MAX_RETRIES - 1) {
                setError(`Failed to load shops. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
                setTimeout(() => fetchShops(location, filters, retryCount + 1), RETRY_DELAY_MS);
            } else {
                setError(err.response?.data?.message || 'Failed to load body shops after multiple attempts.');
                toast.error(err.response?.data?.message || 'Failed to load body shops.', { position: 'top-right' });
                // Error Handling: Handle "No shops found" (Free), API timeouts (Standard), unavailable shops (Wow++)
                if (err.response?.status === 404) {
                     toast.info("No shops found matching your criteria.");
                } else if (err.code === 'ECONNABORTED') { // Example for Axios timeout
                    toast.warn("API request timed out. Please try again.");
                } else if (userTier === 'wowplus' && err.message.includes('unavailable')) {
                    toast.warn("Some shops are temporarily unavailable. Showing available only.");
                }
            }
        } finally {
            if (retryCount >= MAX_RETRIES - 1 || error === null) { // Only set loading to false after final attempt or success
                setLoading(false);
            }
        }
    }, [userTier, userId, searchLocation, serviceFilter, minRatingFilter, priceRangeFilter, advancedFilters, damagePhotos, error]);


    useEffect(() => {
        // Initial fetch or fetch on location/filter changes
        if (searchLocation) {
            logger.info(`BodyShopDiscoveryPage: Initiating search for location: ${searchLocation}`);
            fetchShops(searchLocation);
        } else if (userTier === 'free' || userTier === 'standard') {
            // For free/standard, might show local default or prompt for location
            // For this mock, if no location, just show some default shops
            logger.info(`BodyShopDiscoveryPage: Initiating default search for tier: ${userTier}`);
            fetchShops('95677'); // Default ZIP for initial load
        }
    }, [searchLocation, fetchShops, userTier]);

    const handleLocationSearch = (e: React.FormEvent) => {
        e.preventDefault();
        logger.info(`BodyShopDiscoveryPage: Location search submitted: ${searchLocation}`);
        fetchShops(searchLocation); // Trigger fetch
    };

    const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setter(e.target.value);
        // Cod1+ TODO: Consider debouncing/throttling for real-time filter application
    };

    const handleAdvancedFilterChange = (key: string, value: any) => {
        setAdvancedFilters((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleDamagePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setDamagePhotos(Array.from(e.target.files));
            toast.info("Damage photos uploaded. Initiating AI matching...", { position: 'top-right' });
            // Cod1+ TODO: Potentially show a visual indicator that AI matching is in progress
        }
    };


    if (loading) return <div className="text-center p-4" aria-live="polite">Searching for body shops...</div>;
    if (error) return <div className="text-center p-4 text-red-600" role="alert">Error: {error}</div>;

    return (
        <div className="body-shop-discovery-page p-4 bg-white rounded-lg shadow-md" aria-label={`Body shop discovery page for ${userTier} tier`}>
            <h1 className="text-2xl font-bold mb-4">Discover Body Shops ({userTier.toUpperCase()} Tier)</h1>

            {/* Search and Filters */}
            <form onSubmit={handleLocationSearch} className="mb-6 p-4 border rounded-md bg-gray-50" aria-label="Body shop search and filters form">
                <div className="mb-4">
                    <label htmlFor="locationSearch" className="block text-sm font-medium text-gray-700 mb-1">Search by ZIP Code or City</label>
                    <input
                        type="text"
                        id="locationSearch"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        placeholder={userTier === 'free' ? 'e.g., 90210 or Los Angeles' : 'e.g., 90210, Los Angeles'}
                        className="input input-bordered w-full"
                        aria-label="Search for body shops by location"
                        // CQS: Keyboard navigation
                    />
                </div>

                {/* Basic Filters (Free Tier and above) */}
                <div className="mb-4">
                    <label htmlFor="minRating" className="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
                    <select
                        id="minRating"
                        value={minRatingFilter}
                        onChange={handleFilterChange(setMinRatingFilter)}
                        className="select select-bordered w-full"
                        aria-label="Filter by minimum rating"
                    >
                        <option value="0">Any Rating</option>
                        <option value="4">4 Stars & Up</option>
                        <option value="4.5">4.5 Stars & Up</option>
                    </select>
                </div>

                {/* Standard Tier Filters */}
                {(userTier === 'standard' || userTier === 'premium' || userTier === 'wowplus') && (
                    <>
                        <div className="mb-4">
                            <label htmlFor="serviceFilter" className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                            <select
                                id="serviceFilter"
                                value={serviceFilter}
                                onChange={handleFilterChange(setServiceFilter)}
                                className="select select-bordered w-full"
                                aria-label="Filter by service type"
                            >
                                <option value="">All Services</option>
                                <option value="Collision Repair">Collision Repair</option>
                                <option value="Paint Jobs">Paint Jobs</option>
                                <option value="Dent Removal">Dent Removal</option>
                                <option value="Frame Straightening">Frame Straightening</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="priceRangeFilter" className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                            <select
                                id="priceRangeFilter"
                                value={priceRangeFilter}
                                onChange={handleFilterChange(setPriceRangeFilter)}
                                className="select select-bordered w-full"
                                aria-label="Filter by price range"
                            >
                                <option value="">Any</option>
                                <option value="$">Low ($)</option>
                                <option value="$$">Medium ($$)</option>
                                <option value="$$$">High ($$$)</option>
                            </select>
                        </div>
                        {/* Cod1+ TODO: Add a clear button for filters */}
                    </>
                )}

                {/* Premium Tier Filters */}
                {(userTier === 'premium' || userTier === 'wowplus') && (
                    <>
                        <div className="mb-4">
                            <label htmlFor="certificationFilter" className="block text-sm font-medium text-gray-700 mb-1">Certification</label>
                            <input type="text" id="certificationFilter" placeholder="e.g., I-CAR Gold" onChange={(e) => handleAdvancedFilterChange('certification', e.target.value)} className="input input-bordered w-full" aria-label="Filter by certification" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="insuranceFilter" className="block text-sm font-medium text-gray-700 mb-1">Insurance Accepted</label>
                            <input type="text" id="insuranceFilter" placeholder="e.g., Geico, State Farm" onChange={(e) => handleAdvancedFilterChange('insurance', e.target.value)} className="input input-bordered w-full" aria-label="Filter by insurance accepted" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="amenitiesFilter" className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
                            <input type="text" id="amenitiesFilter" placeholder="e.g., Loaner Cars, Shuttle" onChange={(e) => handleAdvancedFilterChange('amenities', e.target.value)} className="input input-bordered w-full" aria-label="Filter by amenities" />
                        </div>
                        {/* Cod1+ TODO: Add UI for saved searches/alerts (in-app notifications) */}
                        <button type="button" className="btn btn-sm mr-2" aria-label="Save current search criteria">Save Search</button>
                        <button type="button" className="btn btn-sm" aria-label="Set up new search alert">Set Alert</button>
                    </>
                )}

                {/* Wow++ Tier: AI-powered Matching */}
                {userTier === 'wowplus' && (
                    <div className="mt-4 p-3 border rounded-md bg-purple-50">
                        <h3 className="text-md font-medium text-gray-700 mb-2">AI-Powered Damage Matching</h3>
                        <label htmlFor="damagePhotos" className="block text-sm font-medium text-gray-700 mb-1">Upload Damage Photos (for AI matching)</label>
                        <input
                            type="file"
                            id="damagePhotos"
                            multiple
                            accept="image/*"
                            onChange={handleDamagePhotoUpload}
                            className="file-input file-input-bordered w-full"
                            aria-label="Upload photos of vehicle damage for AI matching"
                        />
                        <p className="text-xs text-gray-500 mt-1">AI will analyze photos to find best-matched shops. ($10/month monetization point)</p>
                        {/* Cod1+ TODO: Implement "Shop Scout" badge logic based on active use of this feature */}
                    </div>
                )}

                <button type="submit" className="btn bg-blue-600 text-white hover:bg-blue-700 w-full mt-4" aria-label="Apply search and filters">
                    Search Shops
                </button>
            </form>

            {/* Search Results Display */}
            <section className="shop-results" aria-live="polite">
                {shops.length === 0 && !loading && !error && searchLocation ? ( // Only show "No shops" if a search was attempted
                    <div className="text-center p-4 text-gray-500">No body shops found matching your criteria.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {shops.map(shop => (
                            <div key={shop.id} className="shop-card border rounded-lg shadow-sm p-4" role="listitem">
                                {userTier === 'wowplus' && shop.aiMatchScore !== undefined && (
                                    <p className="font-bold text-purple-700 text-right text-sm" aria-label={`AI match score: ${Math.round(shop.aiMatchScore * 100)} percent`}>AI Match: {Math.round(shop.aiMatchScore * 100)}%</p>
                                )}
                                <h3 className="text-lg font-semibold mb-1" aria-level={3}>{shop.name}</h3>
                                <p className="text-sm text-gray-600 mb-2" aria-label={`Address: ${shop.address}, ${shop.city}, ${shop.zipCode}`}>{shop.address}, {shop.city}, {shop.zipCode}</p>
                                <p className="text-md font-bold text-yellow-500" aria-label={`Rating: ${shop.rating} out of 5 stars`}>Rating: {shop.rating} ({shop.totalReviews} reviews)</p>

                                {/* Standard Tier */}
                                {userTier !== 'free' && (
                                    <>
                                        {shop.primaryPhoto && <img src={shop.primaryPhoto} alt={`Primary photo of ${shop.name}`} className="w-full h-32 object-cover rounded-md mt-2" />}
                                        {shop.services && shop.services.length > 0 && (
                                            <p className="text-sm text-gray-700 mt-2" aria-label={`Services offered: ${shop.services.join(', ')}`}>
                                                Services: {shop.services.join(', ')}
                                            </p>
                                        )}
                                        {shop.priceRange && <p className="text-sm text-gray-700">Price Range: {shop.priceRange}</p>}
                                        {/* Cod1+ TODO: Integrate Auctions Integration - link to relevant auctions by this shop */}
                                    </>
                                )}

                                {/* Premium Tier */}
                                {(userTier === 'premium' || userTier === 'wowplus') && (
                                    <>
                                        {shop.certifications && shop.certifications.length > 0 && (
                                            <p className="text-sm text-gray-700">Certifications: {shop.certifications.join(', ')}</p>
                                        )}
                                        {shop.insuranceAccepted && shop.insuranceAccepted.length > 0 && (
                                            <p className="text-sm text-gray-700">Insurance Accepted: {shop.insuranceAccepted.join(', ')}</p>
                                        )}
                                        {shop.amenities && shop.amenities.length > 0 && (
                                            <p className="text-sm text-gray-700">Amenities: {shop.amenities.join(', ')}</p>
                                        )}
                                        {/* Cod1+ TODO: Add "Instant Quote" button (requires API integration) */}
                                        <button className="btn btn-sm mt-3">Get Instant Quote</button>
                                    </>
                                )}

                                {/* Wow++ Tier */}
                                {userTier === 'wowplus' && (
                                    <div className="mt-2 text-sm">
                                        {shop.isAvailable !== undefined && (
                                            <p className={`font-medium ${shop.isAvailable ? 'text-green-600' : 'text-red-600'}`} aria-label={`Availability status: ${shop.isAvailable ? 'Currently available' : 'Currently unavailable'}`}>
                                                Status: {shop.isAvailable ? 'Available Now' : 'Unavailable'}
                                            </p>
                                        )}
                                        {/* Cod1+ TODO: Link to specific comparison table entry for this shop */}
                                        <button className="btn btn-sm mt-2">Compare Shops</button>
                                    </div>
                                )}

                                <button className="btn btn-primary mt-3 w-full" aria-label={`View details for ${shop.name}`}>View Details</button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Standard Tier: Map View */}
            {(userTier === 'standard' || userTier === 'premium' || userTier === 'wowplus') && shops.length > 0 && (
                <section className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Body Shops on Map</h2>
                    <div className="map-container h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                        {/* Cod1+ TODO: Integrate actual map component like MapComponent */}
                        {/* <MapComponent shops={shops} /> */}
                        <p className="text-gray-500">Interactive Map View Placeholder</p>
                    </div>
                </section>
            )}

            {/* Wow++ Tier: Interactive Comparison */}
            {userTier === 'wowplus' && shops.length > 1 && (
                <section className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Interactive Shop Comparison</h2>
                    <div className="comparison-table-container">
                        {/* Cod1+ TODO: Integrate ComparisonTable component */}
                        {/* <ComparisonTable shops={shops} /> */}
                        <p className="text-gray-500">Interactive Comparison Table Placeholder</p>
                    </div>
                </section>
            )}
        </div>
    );
};

export default BodyShopDiscoveryPage;