import React, { useState } from 'react';
import Navbar from './Navbar';

const SupportCenter = () => {
const [query, setQuery] = useState('');

const handleSubmit = (e) => {
e.preventDefault();
alert(Support query submitted: ${query});
setQuery('');
};

return (

<div> <Navbar /> <div className="p-4"> <h1 className="text-2xl font-bold mb-4">Support Center</h1> <form onSubmit={handleSubmit}> <textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Describe your issue..." className="w-full p-2 border rounded" /> <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2"> Submit Query </button> </form> <h2 className="text-xl mt-6">FAQs</h2> <p>Find answers to common questions or contact support.</p> </div> </div> ); };
export default SupportCenter;