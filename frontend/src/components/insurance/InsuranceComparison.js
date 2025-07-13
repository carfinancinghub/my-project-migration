import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const InsuranceComparison = () => {
const [quotes, setQuotes] = useState([]);

useEffect(() => {
axios.get('/api/insurance/quotes').then(res => setQuotes(res.data));
}, []);

return (

<div> <Navbar /> <div className="p-4"> <h1 className="text-2xl font-bold mb-4">Insurance Comparison</h1> <div className="grid gap-4"> {quotes.map(quote => ( <div key={quote._id} className="border p-4 rounded"> <h2 className="text-lg">{quote.provider}</h2> <p>Premium: ${quote.premium}/month</p> <p>Coverage: {quote.coverage}</p> <button className="bg-blue-500 text-white px-4 py-2 rounded">Select Plan</button> </div> ))} </div> </div> </div> ); };
export default InsuranceComparison;