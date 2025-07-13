/*
File: CompareShopsTable.tsx
Path: C:\CFH\frontend\src\components\body-shop\CompareShopsTable.tsx
Created: 2025-07-05 02:30 PM PDT
Author: Mini (AI Assistant)
Version: 1.2
Description: React component for comparing body shops with a sortable table, including tier enforcement, tooltips, i18n, and optimized logging.
Artifact ID: o4p5q6r7-s8t9-u0v1-w2x3-y4z5a6b7c8d9
Version ID: p5q6r7s8-t9u0-v1w2-x3y4-z5a6b7c8d9e0 // New unique ID for version 1.2
*/

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import logger from '@/utils/logger'; // Centralized logging utility
import { Tooltip } from 'react-tooltip'; // npm install react-tooltip
import { useTranslation } from '@/utils/i18n'; // Assuming an i18n hook
// Cod1+ TODO: Import a generic NoData component for empty states
// import { NoData } from '@/components/common/NoData';

// --- Mock `useTranslation` hook for local testing ---
// Cod1+ TODO: Replace with actual i18n implementation (e.g., react-i18next)
const mockUseTranslation = () => {
    const t = useCallback((key: string, options?: any) => {
        const translations: { [k: string]: string } = {
            'compareShopsTitle': 'Compare Body Shops',
            'shopNameHeader': 'Shop Name',
            'ratingHeader': 'Rating',
            'distanceHeader': 'Distance (miles)',
            'priceRangeHeader': 'Price Range',
            'keyServicesHeader': 'Key Services',
            'aiMatchHeader': 'AI Match',
            'noShopsToCompare': 'No shops selected for comparison.',
            'selectTwoShops': 'Please select at least two shops from the discovery page to compare.',
            'noShopsMatchingFilters': 'No shops found matching your current filters.',
            'aiMatchTooltip': 'AI-generated score for how well the shop matches your repair needs.',
            'priceRangeTooltip': 'Indicates general price level: $ (Budget), $$ (Mid-range), $$$ (Premium).',
            'aiMatchDisclaimer': '*AI Match Score is a preliminary assessment and may vary.',
            'renderTimeExceeded': 'Render time exceeded 500ms: {{time}}ms',
            'loadingShops': 'Loading shops for comparison...',
            'loadingError': 'Error loading comparison data.',
            'noDataAvailable': 'No data available.',
            'sortAscending': 'Sort by {{label}} ascending',
            'sortDescending': 'Sort by {{label}} descending',
        };
        return translations[key] || key; // Return key if no translation found
    }, []);
    return { t };
};
// Use the mock or actual implementation based on environment
const useTranslationActual = typeof window !== 'undefined' && (window as any).i18nLoaded ? require('@utils/i18n').useTranslation : mockUseTranslation;


// --- Mock `NoData` component for local testing ---
// Cod1+ TODO: Replace with actual NoData component from `@components/common/NoData`
const MockNoData: React.FC<{ message?: string; subMessage?: string }> = ({ message, subMessage }) => (
    <div className="text-center p-8 text-gray-500">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 10a2 2 0 01-2-2V7a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H5z" />
        </svg>
        <p className="mt-2 text-sm font-medium">{message || "No data available."}</p>
        {subMessage && <p className="mt-1 text-sm text-gray-500">{subMessage}</p>}
    </div>
);
// Use the mock or actual implementation
const NoDataComponent = typeof window !== 'undefined' && (window as any).NoDataLoaded ? require('@components/common/NoData').NoData : MockNoData;


// Assuming hasTierAccess utility for frontend tier enforcement
// Cod1+ TODO: Implement this utility or integrate with AuthContext to get user tier directly
const hasTierAccess = (currentUserTier: string, requiredTier: string): boolean => {
    const tierOrder = { free: 0, standard: 1, premium: 2, wowplus: 3 };
    return tierOrder[currentUserTier] >= tierOrder[requiredTier];
};


// Define types for Body Shop data (simplified for comparison table)
interface ShopComparisonData {
    id: string;
    name: string;
    rating: number;
    distance: number; // in miles/km
    priceRange?: string; // e.g., '$', '$$', '$$$'
    services?: string[]; // key services
    aiMatchScore?: number; // Wow++ tier
    // Add other relevant comparison metrics (e.g., certifications, average repair time)
}

// Define props for the CompareShopsTable component
interface CompareShopsTableProps {
    shops: ShopComparisonData[]; // Array of shops to compare
    userTier: 'free' | 'standard' | 'premium' | 'wowplus'; // User's current tier
}

const CompareShopsTable: React.FC<CompareShopsTableProps> = ({ shops, userTier }) => {
    const { t } = useTranslationActual(); // i18n hook
    const [sortKey, setSortKey] = useState<keyof ShopComparisonData | null>('distance'); // Default sort by distance
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Ref to capture render start time for performance logging
    const renderStartTimeRef = useRef<number | null>(null);

    // Effect to log render performance after component has rendered
    useEffect(() => {
        if (renderStartTimeRef.current !== null) {
            const renderTimeMs = performance.now() - renderStartTimeRef.current;
            // CQS: Audit logging for render performance at debug level
            logger.debug(t('renderTimeExceeded', { time: renderTimeMs.toFixed(2) }), { component: 'CompareShopsTable', renderTime: renderTimeMs });
            if (renderTimeMs > 500) { // CQS: <500ms render (95% requests)
                logger.warn(t('renderTimeExceeded', { time: renderTimeMs.toFixed(2) }), { component: 'CompareShopsTable', renderTime: renderTimeMs });
            }
        }
        renderStartTimeRef.current = performance.now(); // Reset for next render cycle
        // Cod1+ TODO: Ensure Tooltip component is rendered somewhere globally or within context
        // <Tooltip id="my-tooltip" /> is typically added at the root of the app
        // For this component, we can add it at the very end
    });


    // Dynamically define headers based on available data and user tier
    const tableHeaders = useMemo(() => {
        const headers: { key: keyof ShopComparisonData; label: string; sortable: boolean; tooltipId?: string; }[] = [
            { key: 'name', label: t('shopNameHeader'), sortable: true },
            { key: 'rating', label: t('ratingHeader'), sortable: true },
            { key: 'distance', label: t('distanceHeader'), sortable: true },
        ];

        if (shops.some(shop => shop.priceRange)) {
            headers.push({ key: 'priceRange', label: t('priceRangeHeader'), sortable: false, tooltipId: 'price-range-tooltip' });
        }
        if (shops.some(shop => shop.services && shop.services.length > 0)) {
            headers.push({ key: 'services', label: t('keyServicesHeader'), sortable: false });
        }
        // Only show AI Match if user has premium or Wow++ access AND any shop has the data
        if (hasTierAccess(userTier, 'premium') && shops.some(shop => shop.aiMatchScore !== undefined)) {
            headers.push({ key: 'aiMatchScore', label: t('aiMatchHeader'), sortable: true, tooltipId: 'ai-match-tooltip' });
        }
        // Cod1+ TODO: Add other headers for comparison metrics (e.g., Certifications, Avg. Repair Time, etc.)
        logger.debug(`CompareShopsTable: Headers composed for tier ${userTier}`, { headers: headers.map(h => h.key) });
        return headers;
    }, [shops, userTier, t]);

    // Memoized sorted shops for performance
    const sortedShops = useMemo(() => {
        if (!sortKey) return shops;

        const sorted = [...shops].sort((a, b) => {
            const aValue = a[sortKey];
            const bValue = b[sortKey];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }
            return 0; // No change if types are incomparable or not string/number
        });
        return sorted;
    }, [shops, sortKey, sortOrder]);

    // Handle sort click
    const handleSort = useCallback((key: keyof ShopComparisonData, sortable: boolean) => {
        if (!sortable) {
            logger.debug(`CompareShopsTable: Attempted to sort non-sortable column: ${String(key)}`);
            return; // Only sort if column is sortable
        }

        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
        logger.info(`CompareShopsTable: Sorted by ${String(key)} ${sortOrder}.`);
    }, [sortKey, sortOrder]);


    // CQS: Accessibility (WCAG 2.1 AA with ARIA labels)
    // Ensure responsiveness with Tailwind classes (e.g., `sm:table-cell` for mobile)
    return (
        <div className="compare-shops-table p-4 bg-white rounded-lg shadow-md" aria-label={t('compareShopsTitle')}>
            <h2 className="text-xl font-bold mb-4">{t('compareShopsTitle')}</h2>
            
            {shops.length === 0 ? (
                // Enhance empty state with a user-friendly message and icon
                <NoDataComponent
                    message={t('noShopsToCompare')}
                    subMessage={t('selectTwoShops')}
                />
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {tableHeaders.map((header) => (
                                    <th
                                        key={header.key}
                                        scope="col"
                                        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                                        onClick={() => handleSort(header.key, header.sortable)}
                                        aria-sort={sortKey === header.key ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                                        aria-label={header.sortable ? (sortKey === header.key ? (sortOrder === 'asc' ? t('sortAscending', { label: header.label }) : t('sortDescending', { label: header.label })) : t('sortAscending', { label: header.label })) : header.label}
                                        data-tooltip-id={header.tooltipId} // For tooltips
                                        data-tooltip-content={
                                            header.tooltipId === 'ai-match-tooltip' ? t('aiMatchTooltip') :
                                            (header.tooltipId === 'price-range-tooltip' ? t('priceRangeTooltip') : undefined)
                                        }
                                    >
                                        {header.label}
                                        {sortKey === header.key && (
                                            <span className="ml-1">
                                                {sortOrder === 'asc' ? ' ▲' : ' ▼'}
                                            </span>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedShops.map((shop) => (
                                <tr key={shop.id} role="row">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sm:table-cell" role="cell">{shop.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 sm:table-cell" role="cell" aria-label={`${shop.rating} out of 5 stars`}>{shop.rating} ⭐</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 sm:table-cell" role="cell" aria-label={`${shop.distance} miles`}>{shop.distance} mi</td>
                                    {shop.priceRange && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 sm:table-cell" role="cell">{shop.priceRange}</td>}
                                    {shop.services && shop.services.length > 0 && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 sm:table-cell" role="cell">{shop.services.join(', ')}</td>}
                                    {hasTierAccess(userTier, 'premium') && shop.aiMatchScore !== undefined && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 sm:table-cell" role="cell" aria-label={`${Math.round(shop.aiMatchScore * 100)} percent AI match`}>{Math.round(shop.aiMatchScore * 100)}%</td>
                                    )}
                                </tr>
                            ))}
                            {sortedShops.length === 0 && shops.length > 0 && ( // Show this if original `shops` had data, but filtering/sorting resulted in no data.
                                <tr>
                                    <td colSpan={tableHeaders.length} className="px-6 py-4 text-center text-sm text-gray-500">
                                        {t('noShopsMatchingFilters')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            
            {/* Tooltip component (needs to be rendered somewhere in the app or specifically here) */}
            <Tooltip id="ai-match-tooltip" />
            <Tooltip id="price-range-tooltip" />

            <p className="text-xs text-gray-500 mt-4">
                {t('aiMatchDisclaimer')}
            </p>
        </div>
    );
};

export default CompareShopsTable;