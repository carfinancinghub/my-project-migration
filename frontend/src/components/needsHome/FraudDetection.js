import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const FraudDetection = () => {
const [alerts, setAlerts] = useState([]);

useEffect(() => {
axios.get('/api/fraud/alerts').then(res => setAlerts(res.data));
}, []);

return (

<div> <Navbar /> <div className="p-4"> <h1 className="text-2xl font-bold mb-4">Fraud Detection</h1> <div className="grid gap-4"> {alerts.map(alert => ( <div key={alert._id} className="border p-4 rounded"> <h2 className="text-lg">Alert ID: {alert._id}</h2> <p>Transaction: {alert.transaction}</p> <p>Risk Level: {alert.risk}</p> <button className="bg-blue-500 text-white px-4 py-2 rounded">Investigate</button> </div> ))} </div> </div> </div> ); };
export default FraudDetection;