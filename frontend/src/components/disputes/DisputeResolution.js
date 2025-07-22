import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const DisputeResolution = () => {
const [disputes, setDisputes] = useState([]);
const [message, setMessage] = useState('');
const token = localStorage.getItem('token');

useEffect(() => {
fetchDisputes();
}, []);

const fetchDisputes = async () => {
try {
const res = await axios.get(${process.env.REACT_APP_API_URL}/api/disputes, {
headers: { Authorization: Bearer ${token} },
});
setDisputes(res.data);
} catch (err) {
setMessage('❌ Failed to fetch disputes');
}
};

const resolveDispute = async (id, resolution) => {
try {
await axios.patch(
${process.env.REACT_APP_API_URL}/api/disputes/${id}/resolve,
{ resolution },
{ headers: { Authorization: Bearer ${token} } }
);
setMessage('✅ Dispute resolved');
fetchDisputes();
} catch (err) {
setMessage('❌ Failed to resolve dispute');
}
};

return (

<div> <Navbar /> <div className="p-4 max-w-4xl mx-auto"> <h1 className="text-2xl font-bold mb-4">Dispute Resolution</h1> {message && <p className="mb-4 text-sm text-red-600">{message}</p>} <div className="grid gap-4"> {disputes.map((dispute) => ( <div key={dispute._id} className="border p-4 rounded"> <h2 className="text-lg">Dispute ID: {dispute._id}</h2> <p>Parties: {dispute.parties}</p> <p>Status: {dispute.status}</p> <textarea placeholder="Enter resolution..." className="w-full p-2 border rounded mt-2" onChange={(e) => (dispute.resolution = e.target.value)} /> <button onClick={() => resolveDispute(dispute._id, dispute.resolution)} className="bg-blue-500 text-white px-4 py-2 rounded mt-2" > Resolve </button> </div> ))} </div> </div> </div> ); };
export default DisputeResolution;