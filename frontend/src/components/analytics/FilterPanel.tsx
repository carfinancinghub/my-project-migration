/*
File: FilterPanel.tsx
Path: C:\CFH\frontend\src\components\analytics\FilterPanel.tsx
Created: 2025-07-02 12:20 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Filter panel component for the Analytics Dashboard with tiered options.
Artifact ID: h9i0j1k2-l3m4-n5o6-p7q8-r9s0t1u2v3w4
Version ID: i0j1k2l3-m4n5-o6p7-q8r9-s0t1u2v3w4x5
*/

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from '@/utils/toast'; // Assuming a toast notification utility
import logger from '@/utils/logger'; // Centralized logging utility
// import { NLPQueryInput } from '@/components/analytics/NLPQueryInput'; // For Wow++ NLP queries

// Define types for filters for better type safety
interface AnalyticsFilters {
    timeRange?: '30d' | '7d' | 'mtd' | 'qtd' | 'ytd' | 'custom';
    module?: 'Auctions' | 'Services' | 'Users' | 'Disputes' | 'All';
    startDate?: string; // ISO 8601 string for custom range
    endDate?: string;   // ISO 8601 string for custom range
    demographics?: { age?: string; gender?: string; }; // Premium tier
    nlpQuery?: string; // Wow++ tier
    // Add more filter types as needed
}

interface FilterPanelProps {
    onFilterChange: (filters: AnalyticsFilters) => void;
    userTier: 'free' | 'standard' | 'premium' | 'wowplus';
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange, userTier }) => {
    const [filters, setFilters] = useState<AnalyticsFilters>({
        timeRange: '30d', // Default for Free Tier
        module: 'All', // Default for Standard Tier
    });
    const [customStartDate, setCustomStartDate] = useState<string>('');
    const [customEndDate, setCustomEndDate] = useState<string>('');
    const [demographicAge, setDemographicAge] = useState<string>('');
    const [demographicGender, setDemographicGender] = useState<string>('');
    const [nlpQuery, setNlpQuery] = useState<string>('');

    // Update internal state when filters change externally (e.g., from parent)
    useEffect(() => {
        // This effect might be useful if filters are also set from outside the panel
        // For now, it mainly initializes defaults based on tier
        if (userTier === 'free') {
            setFilters({ timeRange: '30d' });
        } else if (userTier === 'standard') {
            setFilters(prev => ({ ...prev, timeRange: '30d', module: 'All' }));
        }
    }, [userTier]);

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        if (name === 'timeRange' && value !== 'custom') {
            setCustomStartDate('');
            setCustomEndDate('');
        }
    };

    const handleCustomDateChange = (type: 'start' | 'end', date: string) => {
        if (type === 'start') {
            setCustomStartDate(date);
        } else {
            setCustomEndDate(date);
        }
    };

    const handleDemographicChange = (type: 'age' | 'gender', value: string) => {
        if (type === 'age') {
            setDemographicAge(value);
        } else {
            setDemographicGender(value);
        }
    };

    const handleNlpQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNlpQuery(e.target.value);
    };

    const handleSubmit = useCallback(() => {
        let currentFiltersToSend: AnalyticsFilters = { ...filters };

        if (filters.timeRange === 'custom') {
            if (!customStartDate || !customEndDate) {
                toast.error('Please select both start and end dates for custom range.', { position: 'top-right' });
                logger.warn('Custom date range missing start/end dates.');
                return;
            }
            currentFiltersToSend.startDate = customStartDate;
            currentFiltersToSend.endDate = customEndDate;
        }

        if ((userTier === 'premium' || userTier === 'wowplus') && (demographicAge || demographicGender)) {
            currentFiltersToSend.demographics = { age: demographicAge, gender: demographicGender };
        }

        if (userTier === 'wowplus' && nlpQuery) {
            currentFiltersToSend.nlpQuery = nlpQuery;
        }

        if (!currentFiltersToSend.timeRange) {
            toast.error('Time range is required.', { position: 'top-right' });
            logger.warn('Filter submission failed: Time range is missing.');
            return;
        }

        // CQS: Ensure <1s load (frontend side of filter application)
        const startTime = performance.now();
        onFilterChange(currentFiltersToSend);
        const endTime = performance.now();
        const filterApplyTime = endTime - startTime;
        if (filterApplyTime > 500) { // Arbitrary threshold for filter application responsiveness
            logger.warn(`Filter panel apply time exceeded 500ms: ${filterApplyTime.toFixed(2)}ms`);
        }
        logger.info(`Filters applied: ${JSON.stringify(currentFiltersToSend)} for tier ${userTier}`);
    }, [filters, customStartDate, customEndDate, demographicAge, demographicGender, nlpQuery, onFilterChange, userTier]);

    // Accessibility: Use aria-label for buttons and input fields
    // CQS: Ensure accessibility with `aria-label`

    return (
        <aside className="filter-panel p-4 bg-gray-100 border-r border-gray-200" style={{ width: '250px' }}>
            <h2 className="text-xl font-semibold mb-4" aria-label="Analytics Filters">Filters</h2>

            {/* Time Range Filter (Free Tier and above) */}
            <div className="mb-4">
                <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700">Time Range</label>
                <select
                    id="timeRange"
                    name="timeRange"
                    value={filters.timeRange}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    aria-label="Select time range for analytics data"
                >
                    <option value="30d">Last 30 Days</option>
                    {(userTier === 'standard' || userTier === 'premium' || userTier === 'wowplus') && (
                        <>
                            <option value="7d">Last 7 Days</option>
                            <option value="mtd">Month-to-Date</option>
                            <option value="qtd">Quarter-to-Date</option>
                            <option value="ytd">Year-to-Date</option>
                            <option value="custom">Custom Range</option>
                        </>
                    )}
                </select>
            </div>

            {/* Custom Date Range (Standard Tier and above, if 'custom' is selected) */}
            {filters.timeRange === 'custom' && (userTier === 'standard' || userTier === 'premium' || userTier === 'wowplus') && (
                <div className="mb-4">
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                        type="date"
                        id="startDate"
                        value={customStartDate}
                        onChange={(e) => handleCustomDateChange('start', e.target.value)}
                        className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        aria-label="Select start date for custom range"
                    />
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mt-2">End Date</label>
                    <input
                        type="date"
                        id="endDate"
                        value={customEndDate}
                        onChange={(e) => handleCustomDateChange('end', e.target.value)}
                        className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        aria-label="Select end date for custom range"
                    />
                </div>
            )}

            {/* Module Filter (Standard Tier and above) */}
            {(userTier === 'standard' || userTier === 'premium' || userTier === 'wowplus') && (
                <div className="mb-4">
                    <label htmlFor="moduleFilter" className="block text-sm font-medium text-gray-700">Module</label>
                    <select
                        id="moduleFilter"
                        name="module"
                        value={filters.module}
                        onChange={handleInputChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        aria-label="Filter analytics by module"
                    >
                        <option value="All">All Modules</option>
                        <option value="Auctions">Auctions</option>
                        <option value="Services">Services</option>
                        <option value="Users">Users</option>
                        <option value="Disputes">Disputes</option>
                    </select>
                </div>
            )}

            {/* Advanced Segmentation (Premium Tier and above) */}
            {(userTier === 'premium' || userTier === 'wowplus') && (
                <div className="mb-4">
                    <h3 className="text-md font-medium text-gray-700 mb-2">Demographics</h3>
                    <label htmlFor="demographicAge" className="block text-sm font-medium text-gray-700">Age Group</label>
                    <select
                        id="demographicAge"
                        value={demographicAge}
                        onChange={(e) => handleDemographicChange('age', e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        aria-label="Filter by age group"
                    >
                        <option value="">Any</option>
                        <option value="18-24">18-24</option>
                        <option value="25-34">25-34</option>
                        <option value="35-44">35-44</option>
                        <option value="45+">45+</option>
                    </select>
                    <label htmlFor="demographicGender" className="block text-sm font-medium text-gray-700 mt-2">Gender</label>
                    <select
                        id="demographicGender"
                        value={demographicGender}
                        onChange={(e) => handleDemographicChange('gender', e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        aria-label="Filter by gender"
                    >
                        <option value="">Any</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            )}

            {/* NLP Query Input (Wow++ Tier only) */}
            {userTier === 'wowplus' && (
                <div className="mb-4">
                    <h3 className="text-md font-medium text-gray-700 mb-2">Natural Language Query</h3>
                    {/* TODO: Integrate actual NLPQueryInput component */}
                    {/* <NLPQueryInput onQuerySubmit={setNlpQuery} /> */}
                    <input
                        type="text"
                        placeholder="e.g., 'Show Q1 vs Q2 sales for SUVs'"
                        value={nlpQuery}
                        onChange={handleNlpQueryChange}
                        className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        aria-label="Enter natural language query for analytics"
                    />
                </div>
            )}

            <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Apply filters"
            >
                Apply Filters
            </button>
        </aside>
    );
};

export default FilterPanel;