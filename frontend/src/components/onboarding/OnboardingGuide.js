import React, { useState } from 'react';
import Navbar from './Navbar';

const OnboardingGuide = () => {
const [step, setStep] = useState(1);

const nextStep = () => setStep(step + 1);
const prevStep = () => setStep(step - 1);

const steps = [
{ title: 'Welcome', content: 'Start your journey with Car Financing Hub!' },
{ title: 'Create Listing', content: 'Learn to list your car for sale.' },
{ title: 'Earn Rewards', content: 'Join loyalty quests for points.' }
];

return (

<div> <Navbar /> <div className="p-4"> <h1 className="text-2xl font-bold mb-4">Onboarding Guide</h1> <div className="border p-4 rounded"> <h2 className="text-lg">{steps[step - 1].title}</h2> <p>{steps[step - 1].content}</p> <div className="mt-4"> {step > 1 && ( <button onClick={prevStep} className="bg-gray-500 text-white px-4 py-2 rounded mr-2"> Previous </button> )} {step < steps.length && ( <button onClick={nextStep} className="bg-blue-500 text-white px-4 py-2 rounded"> Next </button> )} {step === steps.length && ( <button className="bg-green-500 text-white px-4 py-2 rounded">Complete</button> )} </div> </div> </div> </div> ); };
export default OnboardingGuide;