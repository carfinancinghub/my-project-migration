import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const MarketplaceInsights = () => {
const [insights, setInsights] = useState([]);

useEffect(() => {
axios.get('/api/ai-insights/marketplace').then(res => setInsights(res.data));
}, []);

return (

<div> <Navbar /> <div className="p-4"> <h1 className="text-2xl font-bold mb-4">Marketplace Insights</h1> <div className="grid gap-4"> {insights.map(insight => ( <div key={insight._id} className="border p-4 rounded"> <h2 className="text-lg">{insight.title}</h2> <p>{insight.description}</p> <p>Trend: {insight.trend}</p> </div> ))} </div> </div> </div> ); };
export default MarketplaceInsights;