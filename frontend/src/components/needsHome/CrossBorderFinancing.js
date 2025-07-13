import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const CrossBorderFinancing = () => {
const [options, setOptions] = useState([]);

useEffect(() => {
axios.get('/api/crossborder/options').then(res => setOptions(res.data));
}, []);

return (

<div> <Navbar /> <div className="p-4"> <h1 className="text-2xl font-bold mb-4">Cross-Border Financing</h1> <div className="grid gap-4"> {options.map(option => ( <div key={option._id} className="border p-4 rounded"> <h2 className="text-lg">{option.country}</h2> <p>Rate: {option.rate}%</p> <p>Requirements: {option.requirements}</p> <button className="bg-blue-500 text-white px-4 py-2 rounded">Apply</button> </div> ))} </div> </div> </div> ); };
export default CrossBorderFinancing;