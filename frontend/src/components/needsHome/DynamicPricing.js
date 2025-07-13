import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const DynamicPricing = () => {
const [prices, setPrices] = useState([]);

useEffect(() => {
axios.get('/api/pricing/dynamic').then(res => setPrices(res.data));
}, []);

return (

<div> <Navbar /> <div className="p-4"> <h1 className="text-2xl font-bold mb-4">Dynamic Pricing</h1> <div className="grid gap-4"> {prices.map(price => ( <div key={price._id} className="border p-4 rounded"> <h2 className="text-lg">Vehicle: {price.vehicle}</h2> <p>Price: ${price.amount}</p> <p>Trend: {price.trend}</p> <button className="bg-blue-500 text-white px-4 py-2 rounded">Adjust Price</button> </div> ))} </div> </div> </div> ); };
export default DynamicPricing;