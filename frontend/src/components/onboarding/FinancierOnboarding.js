import React, { useState } from 'react';
import Navbar from './Navbar';

const FinancierOnboarding = () => {
const [formData, setFormData] = useState({ name: '', institution: '', license: '' });

const handleSubmit = (e) => {
e.preventDefault();
alert(Financier onboarding submitted: ${JSON.stringify(formData)});
};

return (

<div> <Navbar /> <div className="p-4"> <h1 className="text-2xl font-bold mb-4">Financier Onboarding</h1> <form onSubmit={handleSubmit}> <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 mb-2 border rounded" /> <input type="text" placeholder="Institution" value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} className="w-full p-2 mb-2 border rounded" /> <input type="text" placeholder="License Number" value={formData.license} onChange={(e) => setFormData({ ...formData, license: e.target.value })} className="w-full p-2 mb-2 border rounded" /> <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded"> Submit </button> </form> </div> </div> ); };
export default FinancierOnboarding;