import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const ReferralAnalytics = () => {
const [referrals, setReferrals] = useState([]);

useEffect(() => {
axios.get('/api/referral-analytics').then(res => setReferrals(res.data));
}, []);

return (

<div> <Navbar /> <div className="p-4"> <h1 className="text-2xl font-bold mb-4">Referral Analytics</h1> <div className="grid gap-4"> {referrals.map(referral => ( <div key={referral._id} className="border p-4 rounded"> <h2 className="text-lg">Referral ID: {referral._id}</h2> <p>Referrer: {referral.referrer}</p> <p>Reward: {referral.reward}</p> <button className="bg-blue-500 text-white px-4 py-2 rounded">View Details</button> </div> ))} </div> </div> </div> ); };
export default ReferralAnalytics;