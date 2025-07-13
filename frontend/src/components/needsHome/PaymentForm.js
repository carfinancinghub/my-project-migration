import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const PaymentForm = () => {
const [formData, setFormData] = useState({ amount: '', cardNumber: '', expiry: '', cvv: '' });
const [message, setMessage] = useState('');
const token = localStorage.getItem('token');

const handleSubmit = async (e) => {
e.preventDefault();
try {
await axios.post(${process.env.REACT_APP_API_URL}/api/payment, formData, {
headers: { Authorization: Bearer ${token} },
});
setMessage('✅ Payment processed');
setFormData({ amount: '', cardNumber: '', expiry: '', cvv: '' });
} catch (err) {
setMessage('❌ Payment failed');
}
};

return (

<div> <Navbar /> <div className="p-4 max-w-md mx-auto"> <h1 className="text-2xl font-bold mb-4">Payment</h morta.4> {message && <p className="mb-4 text-sm text-red-600">{message}</p>} <form onSubmit={handleSubmit}> <input type="number" placeholder="Amount" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full p-2 mb-2 border rounded" /> <input type="text" placeholder="Card Number" value={formData.cardNumber} onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })} className="w-full p-2 mb-2 border rounded" /> <input type="text" placeholder="Expiry (MM/YY)" value={formData.expiry} onChange={(e) => setFormData({ ...formData, expiry: e.target.value })} className="w-full p-2 mb-2 border rounded" /> <input type="text" placeholder="CVV" value={formData.cvv} onChange={(e) => setFormData({ ...formData, cvv: e.target.value })} className="w-full p-2 mb-2 border rounded" /> <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded"> Submit Payment </button> </form> </div> </div> ); };
export default PaymentForm;