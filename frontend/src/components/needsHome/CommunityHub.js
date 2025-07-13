import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const CommunityHub = () => {
const [posts, setPosts] = useState([]);

useEffect(() => {
axios.get('/api/community').then(res => setPosts(res.data));
}, []);

return (

<div> <Navbar /> <div className="p-4"> <h1 className="text-2xl font-bold mb-4">Community Hub</h1> <div className="grid gap-4"> {posts.map(post => ( <div key={post._id} className="border p-4 rounded"> <h2 className="text-lg">{post.title}</h2> <p>By {post.author}</p> <p>{post.content}</p> <button className="bg-blue-500 text-white px-4 py-2 rounded">Comment</button> </div> ))} </div> </div> </div> ); };
export default CommunityHub;