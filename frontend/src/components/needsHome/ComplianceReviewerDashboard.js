import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const ComplianceReviewerDashboard = () => {
const [reviews, setReviews] = useState([]);

useEffect(() => {
axios.get('/api/compliance/reviews').then(res => setReviews(res.data));
}, []);

return (

<div> <Navbar /> <div className="p-4"> <h1 className="text-2xl font-bold mb-4">Compliance Reviewer Dashboard</h1> <div className="grid gap-4"> {reviews.map(review => ( <div key={review._id} className="border p-4 rounded"> <h2 className="text-lg">Review ID: {review._id}</h2> <p>Transaction: {review.transaction}</p> <p>Status: {review.status}</p> <button className="bg-blue-500 text-white px-4 py-2 rounded">Approve</button> </div> ))} </div> </div> </div> ); };
export default ComplianceReviewerDashboard;