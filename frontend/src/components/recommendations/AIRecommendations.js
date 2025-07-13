import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const AIRecommendations = () => {
const [recommendations, setRecommendations] = useState([]);

useEffect(() => {
axios.get('/api/ai-recommendations').then(res => setRecommendations(res.data));
}, []);

return (

<div> <Navbar /> <div className="p-4 max-w-4xl mx-auto"> <h1 className="text-2xl font-bold mb-4">AI Recommendations</h1> <div className="grid gap-4"> {recommendations.map(rec => ( <div key={rec._id} className="border p-4 rounded"> <h2 className="text-lg">{rec.title}</h2> <p>{rec.description}</p> <p>Confidence: {rec.confidence}%</p> </div> ))} </div> </div> </div> ); };
export default AIRecommendations;