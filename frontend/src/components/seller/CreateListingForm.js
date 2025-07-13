import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './common/Navbar';

const CreateListingForm = () => {
const [formData, setFormData] = useState({ make: '', model: '', year: '', price: '' });

const handleSubmit = async (e) => {
e.preventDefault();
try {
await axios.post('/api/listings', formData);
alert('Listing created!');
setFormData({ make: '', model: '', year: '', price: '' });
} catch (error) {
alert('Error creating listing');
}
};

return (

<div> <Navbar /> <div className="p-4"> <h1 className="text-2xl font-bold mb-4">Create Listing</h1> <form onSubmit={handleSubmit}> <input type="text" placeholder="Make" value={formData.make} onChange={(e) => setFormData({ ...formData, make: e.target.value })} className="w-full p-2 mb-2 border rounded" /> <input type="text" placeholder="Model" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} className="w-full p-2 mb-2 border rounded" /> <input type="number" placeholder="Year" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="w-full p-2 mb-2 border rounded" /> <input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full p-2 mb-2 border rounded" /> <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded"> Submit </button> </form> </div> </div> ); };
export default CreateListingForm;