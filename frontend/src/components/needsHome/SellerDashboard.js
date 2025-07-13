import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateListingForm from './CreateListingForm';
import Navbar from './Navbar';

const SellerDashboard = () => {
const [listings, setListings] = useState([]);

useEffect(() => {
axios.get('/api/listings').then(res => setListings(res.data));
}, []);

return (

<div> <Navbar /> <div className="p-4"> <h1 className="text-2xl font-bold mb-4">Seller Dashboard</h1> <CreateListingForm /> <h2 className="text-xl mt-6 mb-2">Your Listings</h2> <div className="grid gap-4"> {listings.map(listing => ( <div key={listing._id} className="border p-4 rounded"> <h3 className="text-lg">{listing.make} {listing.model}</h3> <p>Year: {listing.year}</p> <p>Price: ${listing.price}</p> <p>Status: {listing.status}</p> </div> ))} </div> </div> </div> ); };
export default SellerDashboard;