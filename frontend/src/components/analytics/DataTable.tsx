/*
File: DataTable.tsx
Path: C:\CFH\frontend\src\components\analytics\DataTable.tsx
Created: 2025-07-02 12:30 PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: Data table component for the Analytics Dashboard with sort/filter capabilities.
Artifact ID: l3m4n5o6-p7q8-r9s0-t1u2-v3w4x5y6z7a8
Version ID: m4n5o6p7-q8r9-s0t1-u2v3-w4x5y6z7a8b9
*/

import React, { useState, useMemo, useCallback } from 'react';
import { toast } from '@/utils/toast'; // Assuming a toast notification utility
import logger from '@/utils/logger'; // Centralized logging utility

// Define prop types for the DataTable
interface DataTableProps {
    title: string;
    headers: { key: string; label: string; sortable?: boolean; filterable?: boolean; }[]; // Headers now include key for data access
    rows: any[]; // Array of objects, where keys match header.key
    userTier?: 'free' | 'standard' | 'premium' | 'wowplus';
    // Additional props for specific features
    peerBenchmarkingData?: any[]; // For Premium Tier
    realtimeUpdates?: boolean; // For Wow++ Tier
}

const DataTable: React.FC<DataTableProps> = ({
    title,
    headers,
    rows,
    userTier = 'free', // Default to free if not provided
    peerBenchmarkingData,
    realtimeUpdates = false,
}) => {
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [filters, setFilters] = useState<{ [key: string]: string }>({});
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Basic data validation
    if (!rows || rows.length === 0) {
        logger.warn(`DataTable "${title}": No data provided for table.`);
        // toast.info(`No data available for "${title}" table.`); // Can be too aggressive
        return <div className="data-table-widget p-4 bg-white rounded-lg shadow-md"><h3 className="text-lg font-semibold mb-2">{title}</h3><p className="text-center text-gray-500">No data available.</p></div>;
    }

    // CQS: Ensure <1s render (frontend perception)
    const startTime = performance.now();

    // Memoized sorted and filtered rows for performance
    const processedRows = useMemo(() => {
        let currentRows = [...rows];

        // Apply global search filter (Standard Tier and above)
        if ((userTier === 'standard' || userTier === 'premium' || userTier === 'wowplus') && searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            currentRows = currentRows.filter(row =>
                headers.some(header =>
                    String(row[header.key]).toLowerCase().includes(lowerCaseSearchTerm)
                )
            );
        }

        // Apply column-specific filters (Standard Tier and above)
        if (userTier === 'standard' || userTier === 'premium' || userTier === 'wowplus') {
            Object.keys(filters).forEach(key => {
                const filterValue = filters[key].toLowerCase();
                if (filterValue) {
                    currentRows = currentRows.filter(row =>
                        String(row[key]).toLowerCase().includes(filterValue)
                    );
                }
            });
        }

        // Apply sorting (Standard Tier and above)
        if ((userTier === 'standard' || userTier === 'premium' || userTier === 'wowplus') && sortColumn) {
            currentRows.sort((a, b) => {
                const aValue = a[sortColumn];
                const bValue = b[sortColumn];

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
                }
                return 0; // No change if types are incomparable or not string/number
            });
        }

        return currentRows;
    }, [rows, headers, sortColumn, sortDirection, filters, searchTerm, userTier]);

    const handleSort = useCallback((columnKey: string, sortable: boolean | undefined) => {
        if (!sortable || (userTier !== 'standard' && userTier !== 'premium' && userTier !== 'wowplus')) return; // Only sortable for Standard+

        if (sortColumn === columnKey) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(columnKey);
            setSortDirection('asc');
        }
        logger.info(`Table "${title}" sorted by ${columnKey} ${sortDirection}.`);
    }, [sortColumn, sortDirection, title, userTier]);

    const handleFilterChange = useCallback((key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        logger.info(`Table "${title}" filter for ${key} changed to "${value}".`);
    }, [title]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        logger.info(`Table "${title}" global search term: "${e.target.value}".`);
    }, [title]);

    const endTime = performance.now();
    const renderTimeMs = endTime - startTime;
    if (renderTimeMs > 1000) { // CQS: <1s render (frontend perception)
        logger.warn(`DataTable "${title}" render time exceeded 1s: ${renderTimeMs.toFixed(2)}ms`);
    }

    // CQS: accessibility with `aria-label`
    return (
        <div className="data-table-widget p-4 bg-white rounded-lg shadow-md" aria-label={`Analytics data table: ${title}`}>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>

            {/* Global Search Input (Standard Tier and above) */}
            {(userTier === 'standard' || userTier === 'premium' || userTier === 'wowplus') && (
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search table..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="input input-bordered w-full"
                        aria-label={`Search ${title} table`}
                    />
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {headers.map((header) => (
                                <th
                                    key={header.key}
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort(header.key, header.sortable)}
                                    aria-sort={sortColumn === header.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                                    aria-label={`Sort by ${header.label}`}
                                >
                                    {header.label}
                                    {(userTier === 'standard' || userTier === 'premium' || userTier === 'wowplus') && header.sortable && (
                                        <span className="ml-1">
                                            {sortColumn === header.key ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : ''}
                                        </span>
                                    )}
                                </th>
                            ))}
                        </tr>
                        {/* Column Filters (Standard Tier and above) */}
                        {(userTier === 'standard' || userTier === 'premium' || userTier === 'wowplus') && (
                            <tr>
                                {headers.map((header) => (
                                    <th key={`${header.key}-filter`} className="px-6 py-2">
                                        {header.filterable && (
                                            <input
                                                type="text"
                                                placeholder={`Filter ${header.label}`}
                                                value={filters[header.key] || ''}
                                                onChange={(e) => handleFilterChange(header.key, e.target.value)}
                                                className="w-full text-xs border-gray-300 rounded-md"
                                                aria-label={`Filter by ${header.label}`}
                                            />
                                        )}
                                    </th>
                                ))}
                            </tr>
                        )}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {processedRows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {headers.map((header) => (
                                    <td key={`${header.key}-${rowIndex}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {row[header.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {processedRows.length === 0 && (
                            <tr>
                                <td colSpan={headers.length} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No matching data found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Premium Tier: Peer Benchmarking Data */}
            {(userTier === 'premium' || userTier === 'wowplus') && peerBenchmarkingData && peerBenchmarkingData.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200" aria-label="Peer benchmarking data">
                    <h4 className="text-md font-semibold text-blue-800 mb-2">Peer Benchmarking Insights</h4>
                    <ul className="list-disc list-inside text-sm text-blue-700">
                        {peerBenchmarkingData.map((data, index) => (
                            <li key={index}>{data.insight} (Average: {data.average})</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Wow++ Tier: Real-time Updates Placeholder */}
            {userTier === 'wowplus' && realtimeUpdates && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200" aria-label="Real-time updates status">
                    <p className="text-sm text-green-800">
                        <span className="font-bold">Live Updates:</span> Data is updating in real-time.
                        {/* TODO: Integrate with WebSocketService.js for actual real-time updates */}
                    </p>
                </div>
            )}
        </div>
    );
};

export default DataTable;