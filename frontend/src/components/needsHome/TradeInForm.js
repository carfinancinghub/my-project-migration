import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const TradeInForm = () => {
const [formData, setFormData] = useState({ make: '', model: '', year: '', condition: '' });
const [message, setMessage] = useState('');
const token = localStorage.getItem('token');

const handleSubmit = async (e) => {
e.preventDefault();
try {
const res = await axios.post(${process.env.REACT_APP_API_URL}/api/tradein/evaluate, formData, {
headers: { Authorization: Bearer ${token} },
});
setMessage(✅ Trade-in value: $${res.data.value});
} catch (err) {
setMessage('❌ Evaluation failed');
}
};

return (

<div> <Navbar /> <div className="p-4 max-w-md mx-auto"> <h1 className="text-2xl font-bold mb-4">Trade-In Evaluation</h1> {message && <p className="mb-4 text-sm text-red-600">{message}</p>} <form onSubmit={handleSubmit}> <input type="text" placeholder="Make" value={formData.make} onChange={(e) => setFormData({ ...formData, make: e.target.value })} className="w-full p-2 mb-2 border rounded" /> <input type="text" placeholder="Model" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} className="w-full p-2 mb-2 border rounded" /> <input type="number" placeholder="Year" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="w-full p-2 mb-2 border rounded" /> <input type="text" placeholder="Condition" value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value })} className="w-full p-2 mb-2 border rounded" /> <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded"> Evaluate Trade-In </button> </form> </div> </div> ); };
export default TradeInForm;