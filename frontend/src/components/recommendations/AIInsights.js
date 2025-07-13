import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const AIInsights = () => {
const [insights, setInsights] = useState([]);

useEffect(() => {
axios.get('/api/ai-insights').then(res => setInsights(res.data));
}, []);

return (

<div> <Navbar /> <div className="p-4"> <h1 className="text-2xl font-bold mb-4">AI Insights</h1> <div className="grid gap-4"> {insights.map(insight => ( <div key={insight._id} className="border p-4 rounded"> <h2 className="text-lg">{insight.title}</h2> <p>{insight.description}</p> <p>Confidence: {insight.confidence}%</p> </div> ))} </div> </div> </div> ); };
export default AIInsights;