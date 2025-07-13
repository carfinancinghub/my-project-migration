// frontend/src/components/mechanic/VRInspectionViewer.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/common/Button'; // Assuming this exists
import { motion } from 'framer-motion';
import {
    CheckCircle,
    XCircle,
    Info,
    VrCard,
    Maximize2,
    Minimize2,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming this exists

// Mock WebXR functions (for demonstration in non-WebXR environments)
const mockXR = {
    isSupported: () => Promise.resolve(false),
    requestSession: () => Promise.reject(new Error('WebXR not supported')),
    endSession: () => Promise.resolve(),
    getDevice: () => null,
};

const VRInspectionViewer = ({ reportData }) => {
    const [isSupported, setIsSupported] = useState(false);
    const [session, setSession] = useState(null);
    const [isImmersive, setIsImmersive] = useState(false);
    const [loading, setLoading] = useState(false);
    const xrRef = useRef(null);

    // Check for WebXR support on mount
    useEffect(() => {
        const checkSupport = async () => {
            try {
                const supported = await (navigator.xr?.isSupported() || mockXR.isSupported());
                setIsSupported(supported);
            } catch (error) {
                console.error("Error checking WebXR support:", error);
                setIsSupported(false); // Assume not supported on error
            }
        };
        checkSupport();
    }, []);

    // Request an immersive VR session
    const enterVR = useCallback(async () => {
        if (!isSupported) return;

        setLoading(true);
        try {
            const newSession = await (navigator.xr?.requestSession('immersive-vr') || mockXR.requestSession());
            setSession(newSession);
            setIsImmersive(true);
            xrRef.current = newSession;

            // Mock session end (for demonstration)
            setTimeout(() => {
                if (newSession) {
                    newSession.end?.(); // Use optional chaining in case mock doesn't have end
                    setSession(null);
                    setIsImmersive(false);
                    xrRef.current = null;
                    setLoading(false);
                }
            }, 5000); // Simulate a 5-second session

        } catch (error) {
            console.error("Error entering VR:", error);
            setSession(null);
            setIsImmersive(false);
            setLoading(false);
            alert(`Failed to enter VR: ${error.message}`); // Basic error feedback
        } finally {
            //setLoading(false); // Removed to keep loading state during mock session
        }
    }, [isSupported]);

    // Exit the immersive VR session
    const exitVR = useCallback(async () => {
        if (!session) return;

        setLoading(true);
        try {
            await (session.end?.() || mockXR.endSession()); // Use optional chaining
            setSession(null);
            setIsImmersive(false);
            xrRef.current = null;
        } catch (error) {
            console.error("Error exiting VR:", error);
        } finally {
            setLoading(false);
        }
    }, [session]);

    // Toggle VR session based on current state
    const toggleVR = () => {
        if (isImmersive) {
            exitVR();
        } else {
            enterVR();
        }
    };

    // Placeholder for 3D rendering (replace with actual WebXR rendering)
    const renderVRScene = () => {
        if (!isImmersive) return null;

        return (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white z-50">
                <Loader2 className="animate-spin w-10 h-10 mb-4" />
                <p>Rendering VR Scene... (Mock)</p>
                {/* Replace this with your Three.js or other 3D rendering code */}
            </div>
        );
    };

    // Placeholder for inspection report viewer
    const renderInspectionReport = () => {
        if (!reportData) {
            return (
                <div className="flex items-center justify-center p-4 text-gray-500">
                    <Info className="w-6 h-6 mr-2" />
                    No inspection report data available.
                </div>
            );
        }

        // Render mock report data. Replace this with your actual InspectionReportViewer component.
        return (
            <div className="p-4 space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Inspection Report (Mock)</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-lg font-medium text-gray-700">Vehicle Details</h3>
                        <ul className="list-disc list-inside">
                            <li>Make: {reportData.make || 'N/A'}</li>
                            <li>Model: {reportData.model || 'N/A'}</li>
                            <li>Year: {reportData.year || 'N/A'}</li>
                            <li>VIN: {reportData.vin || 'N/A'}</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-700">Inspection Results</h3>
                        <ul className="list-disc list-inside">
                            {reportData.passed ? (
                                <li className="text-green-600 flex items-center">
                                    <CheckCircle className="w-4 h-4 mr-1" /> Passed
                                </li>
                            ) : (
                                <li className="text-red-600 flex items-center">
                                    <XCircle className="w-4 h-4 mr-1" /> Failed
                                </li>
                            )}
                            <li>Overall Condition: {reportData.condition || 'N/A'}</li>
                            <li>Notes: {reportData.notes || 'No notes'}</li>
                        </ul>
                    </div>
                </div>
                {/* Add more report sections as needed */}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md py-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <VrCard className="w-6 h-6 mr-2 text-blue-500" />
                        VR Inspection Viewer
                    </h1>
                    {isSupported && (
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <Button
                                onClick={toggleVR}
                                variant="outline"
                                className={cn(
                                    "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-blue-400",
                                    "px-4 py-2 rounded-full font-semibold transition-colors duration-300",
                                    "flex items-center",
                                    isImmersive ? "border-red-500 text-red-500" : "border-blue-500"
                                )}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                                        {isImmersive ? 'Exiting VR...' : 'Entering VR...'}
                                    </>
                                ) : (
                                    <>
                                        {isImmersive ? (
                                            <>
                                                <Minimize2 className="w-4 h-4 mr-2" /> Exit VR
                                            </>
                                        ) : (
                                            <>
                                                <Maximize2 className="w-4 h-4 mr-2" /> Enter VR
                                            </>
                                        )}
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    )}
                </div>
            </header>

            <main className="container mx-auto py-8">
                {renderInspectionReport()}
                {renderVRScene()} {/* Render the VR scene if in immersive mode */}
            </main>

            <footer className="bg-white shadow-inner py-4 mt-8">
                <div className="container mx-auto text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Crown Certified. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default VRInspectionViewer;
