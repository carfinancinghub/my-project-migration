import React, { useState } from 'react';
import Navbar from './Navbar';

const VoiceInteraction = () => {
const [transcript, setTranscript] = useState('');

const handleVoice = () => {
alert('Voice interaction started');
setTranscript('Sample voice command processed');
};

return (

<div> <Navbar /> <div className="p-4"> <h1 className="text-2xl font-bold mb-4">Voice Interaction</h1> <button onClick={handleVoice} className="bg-blue-500 text-white px-4 py-2 rounded"> Start Voice Command </button> {transcript && <p className="mt-4">{transcript}</p>} </div> </div> ); };
export default VoiceInteraction;