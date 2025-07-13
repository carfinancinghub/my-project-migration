import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const VRInspection = () => {
const [vehicleId, setVehicleId] = useState('');
const [message, setMessage] = useState('');
const token = localStorage.getItem('token');

const handleSubmit = async (e) => {
e.preventDefault();
try {
const res = await axios.post(
${process.env.REACT_APP_API_URL}/api/vr-inspection/inspection,
{ vehicle: vehicleId },
{ headers: { Authorization: Bearer ${token} } }
);
setMessage(✅ Inspection report: ${res.data.report});
} catch (err) {
setMessage('❌ Inspection failed');
}
};

return (

<div> <Navbar /> <div className="p-4 max-w-md mx-auto"> <h1 className="text-2xl font-bold mb-4">VR Inspection</h1> {message && <p className="mb-4 text-sm text-red-600">{message}</p>} <form onSubmit={handleSubmit}> <input type="text" placeholder="Vehicle ID" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className="w-full p-2 mb-2 border rounded" /> <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded"> Start VR Inspection </button> </form> </div> </div> ); };
export default VRInspection;