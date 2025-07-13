/*
File: PartsOrderForm.tsx
Path: C:\CFH\frontend\src\components\body-shop\PartsOrderForm.tsx
Created: 2025-07-05 10:41 AM PDT
Author: Mini (AI Assistant)
Version: 1.0
Description: React component for a parts order form with validation and submission.
Artifact ID: f5g6h7i8-j9k0-l1m2-n3o4-p5q6r7s8t9u0
Version ID: g6h7i8j9-k0l1-m2n3-o4p5-q6r7s8t9u0v1
*/

import React, { useState, useCallback } from 'react';
import { z } from 'zod'; // For form validation
import logger from '@/utils/logger'; // Centralized logging utility
import { toast } from '@/utils/toast'; // Assuming a toast notification utility
// Cod1+ TODO: Import the actual parts ordering API service
// import { partsOrderingApi } from '@/services/partsOrderingApi';

// --- Zod Schema for Form Validation ---
const partSchema = z.object({
    partName: z.string().min(2, "Part name must be at least 2 characters").max(100, "Part name cannot exceed 100 characters"),
    quantity: z.number().int().positive("Quantity must be a positive whole number"),
    partNumber: z.string().optional(), // Optional part number
    supplierId: z.string().uuid("Invalid supplier ID format").optional(), // Optional supplier ID
    price: z.number().positive("Price must be positive").optional(), // Optional price per part
});

const partsOrderFormSchema = z.object({
    jobId: z.string().uuid("Invalid Job ID format"),
    shopId: z.string().uuid("Invalid Shop ID format").optional(), // Assuming the shop ordering the parts, might be derived from auth
    parts: z.array(partSchema).min(1, "At least one part is required for the order."),
});

// Define form data type based on schema
type PartsOrderFormData = z.infer<typeof partsOrderFormSchema>;

// --- Component Props ---
interface PartsOrderFormProps {
    jobId: string; // The job for which parts are being ordered
    shopId?: string; // The shop placing the order (optional if derived from context/auth)
    userTier?: 'free' | 'standard' | 'premium' | 'wowplus'; // For future tiered features if any
}

const PartsOrderForm: React.FC<PartsOrderFormProps> = ({ jobId, shopId, userTier }) => {
    const [formData, setFormData] = useState<PartsOrderFormData>({
        jobId: jobId,
        shopId: shopId, // Pre-fill if provided
        parts: [{ partName: '', quantity: 1 }],
    });
    const [errors, setErrors] = useState<z.ZodIssue[]>([]);
    const [loading, setLoading] = useState(false);

    // Handle input changes for main form fields
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    // Handle input changes for part fields (nested array)
    const handlePartInputChange = useCallback((index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        const newParts = [...formData.parts];
        // Convert quantity and price to number if input type is number
        (newParts[index] as any)[name] = (type === 'number' || name === 'price') ? parseFloat(value) : value;
        setFormData(prev => ({ ...prev, parts: newParts }));
    }, [formData.parts]);

    // Add a new part row
    const addPartRow = useCallback(() => {
        setFormData(prev => ({
            ...prev,
            parts: [...prev.parts, { partName: '', quantity: 1 }],
        }));
    }, []);

    // Remove a part row
    const removePartRow = useCallback((index: number) => {
        setFormData(prev => ({
            ...prev,
            parts: prev.parts.filter((_, i) => i !== index),
        }));
    }, []);

    // Form submission handler
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors([]); // Clear previous errors

        const startTime = performance.now(); // CQS: Performance monitoring

        try {
            // Validate form data using Zod schema
            const validatedData = partsOrderFormSchema.parse(formData);
            
            // Cod1+ TODO: Call actual parts ordering API service
            // const response = await partsOrderingApi.placeOrder(validatedData);

            // Simulate API call success
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate 300ms delay
            logger.info(`PartsOrderForm: Order submitted successfully for Job ID: ${validatedData.jobId}`);
            toast.success('Parts order placed successfully!', { position: 'top-right' });

            // CQS: Audit logging for successful order submission
            logger.info(`AUDIT: Parts order placed for Job ID: ${validatedData.jobId}, Shop ID: ${validatedData.shopId || 'N/A'}`);

            // Reset form or navigate
            setFormData({ jobId: jobId, shopId: shopId, parts: [{ partName: '', quantity: 1 }] }); // Reset to initial state
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(error.errors);
                const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join('; ');
                logger.warn(`PartsOrderForm: Validation failed for submission: ${errorMessages}`);
                toast.error(`Validation Error: ${error.errors[0].message}`, { position: 'top-right' });
            } else {
                // Cod1+ TODO: Handle API submission errors (e.g., network issues, backend errors)
                logger.error('PartsOrderForm: API submission failed:', error);
                toast.error('Failed to place parts order. Please try again.', { position: 'top-right' });
                setErrors([{ path: ['submission'], message: 'Failed to place order due to server error.' } as z.ZodIssue]);
            }
        } finally {
            setLoading(false);
            const endTime = performance.now();
            const submissionTimeMs = endTime - startTime;
            if (submissionTimeMs > 500) { // CQS: <500ms response (95%)
                logger.warn(`PartsOrderForm submission time exceeded 500ms: ${submissionTimeMs.toFixed(2)}ms`);
            }
        }
    }, [formData, jobId, shopId]);

    // CQS: Accessibility (WCAG 2.1 AA with ARIA labels)
    return (
        <div className="parts-order-form p-4 bg-white rounded-lg shadow-md" aria-label="Parts order form">
            <h2 className="text-2xl font-bold mb-4">Order Parts for Job ID: {jobId}</h2>
            {shopId && <p className="text-sm text-gray-600 mb-4">Shop ID: {shopId}</p>}

            <form onSubmit={handleSubmit} aria-labelledby="parts-order-form-title">
                {/* Hidden fields for jobId and shopId, pre-filled from props */}
                <input type="hidden" name="jobId" value={formData.jobId} />
                {formData.shopId && <input type="hidden" name="shopId" value={formData.shopId} />}

                <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Parts List</h3>
                    {formData.parts.map((part, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 p-3 border rounded-md bg-gray-50" aria-label={`Part ${index + 1} details`}>
                            <div>
                                <label htmlFor={`partName-${index}`} className="block text-sm font-medium text-gray-700">Part Name</label>
                                <input
                                    type="text"
                                    id={`partName-${index}`}
                                    name="partName"
                                    value={part.partName}
                                    onChange={(e) => handlePartInputChange(index, e)}
                                    className="input input-bordered w-full"
                                    required
                                    aria-required="true"
                                    aria-label={`Part name for item ${index + 1}`}
                                />
                                {errors.find(err => err.path[1] === index && err.path[2] === 'partName') && (
                                    <p className="text-red-500 text-xs mt-1" role="alert">
                                        {errors.find(err => err.path[1] === index && err.path[2] === 'partName')?.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label htmlFor={`quantity-${index}`} className="block text-sm font-medium text-gray-700">Quantity</label>
                                <input
                                    type="number"
                                    id={`quantity-${index}`}
                                    name="quantity"
                                    value={part.quantity}
                                    onChange={(e) => handlePartInputChange(index, e)}
                                    className="input input-bordered w-full"
                                    min="1"
                                    required
                                    aria-required="true"
                                    aria-label={`Quantity for item ${index + 1}`}
                                />
                                {errors.find(err => err.path[1] === index && err.path[2] === 'quantity') && (
                                    <p className="text-red-500 text-xs mt-1" role="alert">
                                        {errors.find(err => err.path[1] === index && err.path[2] === 'quantity')?.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label htmlFor={`partNumber-${index}`} className="block text-sm font-medium text-gray-700">Part Number (Optional)</label>
                                <input
                                    type="text"
                                    id={`partNumber-${index}`}
                                    name="partNumber"
                                    value={part.partNumber || ''}
                                    onChange={(e) => handlePartInputChange(index, e)}
                                    className="input input-bordered w-full"
                                    aria-label={`Part number for item ${index + 1}`}
                                />
                            </div>
                            <div>
                                <label htmlFor={`price-${index}`} className="block text-sm font-medium text-gray-700">Price (Optional)</label>
                                <input
                                    type="number"
                                    id={`price-${index}`}
                                    name="price"
                                    value={part.price || ''}
                                    onChange={(e) => handlePartInputChange(index, e)}
                                    className="input input-bordered w-full"
                                    min="0"
                                    step="0.01"
                                    aria-label={`Price for item ${index + 1}`}
                                />
                            </div>
                            {formData.parts.length > 1 && (
                                <div className="md:col-span-4 text-right">
                                    <button
                                        type="button"
                                        onClick={() => removePartRow(index)}
                                        className="btn btn-sm btn-error"
                                        aria-label={`Remove part item ${index + 1}`}
                                    >
                                        Remove Part
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addPartRow}
                        className="btn btn-outline btn-primary mt-4"
                        aria-label="Add another part to the order"
                    >
                        Add Another Part
                    </button>
                </section>

                {errors.length > 0 && (
                    <div className="text-red-500 text-sm mb-4" role="alert">
                        <p className="font-semibold">Please correct the following errors:</p>
                        <ul className="list-disc list-inside">
                            {errors.map((err, index) => (
                                <li key={index}>{err.path.join('.')}: {err.message}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <button
                    type="submit"
                    className="btn bg-blue-600 text-white hover:bg-blue-700 w-full"
                    disabled={loading}
                    aria-label={loading ? 'Placing order...' : 'Place Order'}
                >
                    {loading ? 'Placing Order...' : 'Place Order'}
                </button>
            </form>
        </div>
    );
};

export default PartsOrderForm;