import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const Leaderboard = () => {
const [leaders, setLeaders] = useState([]);

useEffect(() => {
axios.get('/api/leaderboard').then(res => setLeaders(res.data));
}, []);

return (

<div> <Navbar /> <div className="p-4 max-w-4xl mx-auto"> <h1 className="text-2xl font-bold mb-4">Leaderboard</h1> <div className="grid gap-4"> {leaders.map((leader, index) => ( <div key={leader._id} className="border p-4 rounded flex justify-between"> <div> <h2 className="text-lg">{index + 1}. {leader.username}</h2> <p>Points: {leader.points}</p> </div> <p>Rank: {leader.rank}</p> </div> ))} </div> </div> </div> ); };
export default Leaderboard;