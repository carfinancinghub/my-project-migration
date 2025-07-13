/**
 * File: BuyerOnboardingGuide.jsx
 * Path: frontend/src/components/buyer/BuyerOnboardingGuide.jsx
 * Author: Mini (05042219)
 * Purpose: Provides interactive tutorials and guidance for new buyers.
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { Progress } from '@/components/ui/progress'; // Assuming this exists
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'; // Assuming this exists
import { motion } from 'framer-motion';
import { CheckCircle, ChevronRight, Info, Award } from 'lucide-react'; // Import Award for loyalty points
import { cn } from '@/lib/utils'; // Assuming this exists

// Mock data for tutorial steps
const tutorialSteps = [
    {
        title: 'How to Search Cars',
        description: 'Learn how to use filters and keywords to find your perfect vehicle.',
        targetElement: '#search-bar', // Example ID, adjust as needed
    },
    {
        title: 'How to Bid',
        description: 'Understand the bidding process and strategies to win auctions.',
        targetElement: '#bid-button', // Example ID, adjust as needed
    },
    {
        title: 'How to Review Contracts',
        description: 'Learn how to review contract terms and conditions before finalizing a purchase.',
        targetElement: '#contract-preview', // Example ID, adjust as needed
    },
];

const BuyerOnboardingGuide = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [isVoiceActive, setIsVoiceActive] = useState(false); // State for voice guidance
    const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null); // State for SpeechSynthesis

    // Initialize SpeechSynthesis
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setSpeechSynthesis(window.speechSynthesis);
        }
    }, []);

    const navigateToNextStep = () => {
        if (!completedSteps.includes(currentStep)) {
            setCompletedSteps([...completedSteps, currentStep]);
        }
        if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const speak = (text: string) => {
        if (speechSynthesis && isVoiceActive) {
            const utterance = new SpeechSynthesisUtterance(text);
            speechSynthesis.speak(utterance);
        }
    };

    useEffect(() => {
        speak(tutorialSteps[currentStep].description);
    }, [currentStep, isVoiceActive, speechSynthesis]);

    const toggleVoiceGuidance = () => {
        setIsVoiceActive(!isVoiceActive);
        if (isVoiceActive && speechSynthesis?.speaking) {
            speechSynthesis.cancel();
        }
    };

    const currentStepData = tutorialSteps[currentStep];
    const progress = (completedSteps.length / tutorialSteps.length) * 100;

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="container mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-gray-900">Buyer Onboarding Guide</h1>

                <div className="bg-white rounded-lg shadow-md p-6 relative">
                    {/* Step Title and Description */}
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">{currentStepData.title}</h2>
                    <p className="text-gray-600 mb-4">{currentStepData.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                        <Progress value={progress} className="h-4" />
                        <p className="text-sm text-gray-500 mt-1">{completedSteps.length}/{tutorialSteps.length} Steps Completed</p>
                    </div>

                    {/* Voice Guidance Toggle (Premium) */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-700 font-medium">Voice Guidance:</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={toggleVoiceGuidance}
                                className={cn(
                                    isVoiceActive
                                        ? "bg-blue-500 text-white hover:bg-blue-600"
                                        : "text-gray-600 hover:bg-gray-100"
                                )}
                            >
                                {isVoiceActive ? 'On' : 'Off'}
                            </Button>
                        </div>
                        {/* Premium label for voice guidance */}
                        <span className="text-xs text-blue-500 font-medium">Pro Feature</span>
                    </div>

                    {/* Tooltip Example */}
                    {currentStepData.targetElement && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div id={currentStepData.targetElement} className="inline-block">
                                    {/* element to attach the tooltip to */}
                                    <span className="text-blue-500 cursor-pointer border-b border-blue-500/50">
                                        {currentStepData.targetElement === '#search-bar' && 'Search Bar'}
                                        {currentStepData.targetElement === '#bid-button' && 'Bid Button'}
                                        {currentStepData.targetElement === '#contract-preview' && 'Contract Preview'}
                                    </span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{`This is where you ${currentStepData.description.toLowerCase()}.`}</p>
                            </TooltipContent>
                        </Tooltip>
                    )}

                    {/* Navigation Button */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-6"
                    >
                        <Button
                            onClick={navigateToNextStep}
                            disabled={currentStep >= tutorialSteps.length - 1}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded flex items-center justify-end w-full"
                        >
                            {currentStep >= tutorialSteps.length - 1 ? 'Finish' : 'Next'}
                            {currentStep < tutorialSteps.length - 1 && <ChevronRight className="ml-2 w-5 h-5" />}
                            {currentStep >= tutorialSteps.length - 1 && <CheckCircle className="ml-2 w-5 h-5" />}
                        </Button>
                    </motion.div>

                    {/* Completion Reward (Premium) */}
                    {currentStep >= tutorialSteps.length - 1 && (
                        <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 flex items-center gap-2">
                            <Award className="w-6 h-6" />
                            <p>
                                Congratulations! You've completed the onboarding guide.
                                <span className="font-semibold"> +100 Loyalty Points Awarded!</span>
                                <span className="text-xs text-yellow-500 font-medium"> (Enterprise Feature)</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BuyerOnboardingGuide;
