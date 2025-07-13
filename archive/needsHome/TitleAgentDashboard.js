import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const TitleAgentDashboard = () => {
const [titles, setTitles] = useState([]);

useEffect(() => {
axios.get('/api/documents/titles').then(res => setTitles(res.data));
}, []);

return (

<div> <Navbar /> <div className="p-4"> <h1 className="text-2xl font-bold mb-4">Title Agent Dashboard</h1> <div className="grid gap-4"> {titles.map(title => ( <div key={title._id} className="border p-4 rounded"> <h2 className="text-lg">Vehicle: {title.vehicle}</h2> <p>Status: {title.status}</p> <button className="bg-blue-500 text-white px-4 py-2 rounded">Process Title</button> </div> ))} </div> </div> </div> ); };
export default TitleAgentDashboard;