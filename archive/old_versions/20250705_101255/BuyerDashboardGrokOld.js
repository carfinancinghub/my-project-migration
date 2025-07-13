import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../common/Navbar';

const BuyerDashboard = () => {
const [cars, setCars] = useState([]);
const [search, setSearch] = useState('');

useEffect(() => {
axios.get('/api/cars').then(res => setCars(res.data));
}, []);

const filteredCars = cars.filter(car =>
car.make.toLowerCase().includes(search.toLowerCase()) ||
car.model.toLowerCase().includes(search.toLowerCase())
);

return (

<div> <Navbar /> <div className="p-4"> <h1 className="text-2xl font-bold mb-4">Buyer Dashboard</h1> <input type="text" placeholder="Search cars..." value={search} onChange={e => setSearch(e.target.value)} className="w-full p-2 mb-4 border rounded" /> <div className="grid gap-4"> {filteredCars.map(car => ( <div key={car._id} className="border p-4 rounded"> <h2 className="text-xl">{car.make} {car.model}</h2> <p>Year: {car.year}</p> <p>Price: ${car.price}</p> <button className="bg-blue-500 text-white px-4 py-2 rounded">Bid</button> </div> ))} </div> </div> </div> ); };
export default BuyerDashboard;