import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const Forum = () => {
const [posts, setPosts] = useState([]);
const [newPost, setNewPost] = useState({ title: '', content: '' });
const [message, setMessage] = useState('');
const token = localStorage.getItem('token');

useEffect(() => {
fetchPosts();
}, []);

const fetchPosts = async () => {
try {
const res = await axios.get(${process.env.REACT_APP_API_URL}/api/community/posts, {
headers: { Authorization: Bearer ${token} },
});
setPosts(res.data);
} catch (err) {
setMessage('❌ Failed to fetch posts');
}
};

const handleSubmit = async (e) => {
e.preventDefault();
try {
await axios.post(${process.env.REACT_APP_API_URL}/api/community/posts, newPost, {
headers: { Authorization: Bearer ${token} },
});
setMessage('✅ Post created');
setNewPost({ title: '', content: '' });
fetchPosts();
} catch (err) {
setMessage('❌ Failed to create post');
}
};

return (

<div> <Navbar /> <div className="p-4 max-w-4xl mx-auto"> <h1 className="text-2xl font-bold mb-4">Community Forum</h1> {message && <p className="mb-4 text-sm text-red-600">{message}</p>} <form onSubmit={handleSubmit} className="mb-6"> <input type="text" placeholder="Post Title" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} className="w-full p-2 mb-2 border rounded" /> <textarea placeholder="Post Content" value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} className="w-full p-2 mb-2 border rounded" /> <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded"> Create Post </button> </form> <div className="grid gap-4"> {posts.map((post) => ( <div key={post._id} className="border p-4 rounded"> <h2 className="text-lg font-semibold">{post.title}</h2> <p className="text-sm text-gray-700">{post.content}</p> <p className="text-xs text-gray-400 mt-1"> By {post.author} on {new Date(post.createdAt).toLocaleString()} </p> <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2"> Comment </button> </div> ))} </div> </div> </div> ); };
export default Forum;