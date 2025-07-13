import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const SustainabilityScoring = () => {
const [scores, setScores] = useState([]);

useEffect(() => {
axios.get('/api/sustainability/scores').then(res => setScores(res.data));
}, []);

return (

<div> <Navbar /> <div className="p-4"> <h1 className="text-2xl font-bold mb-4">Sustainability Scoring</h1> <div className="grid gap-4"> {scores.map(score => ( <div key={score._id} className="border p-4 rounded"> <h2 className="text-lg">Vehicle: {score.vehicle}</h2> <p>Score: {score.score}/100</p> <p>Details: {score.details}</p> </div> ))} </div> </div> </div> ); };
export default SustainabilityScoring;