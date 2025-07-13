import React, { useState } from 'react';
import useAuth from './useAuth';
import Navbar from './Navbar';

const LoginForm = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [message, setMessage] = useState('');
const { login } = useAuth();

const handleSubmit = async (e) => {
e.preventDefault();
try {
await login(email, password);
setMessage('✅ Login successful');
} catch (err) {
setMessage('❌ Login failed');
}
};

return (

<div> <Navbar /> <div className="p-4 max-w-md mx-auto"> <h1 className="text-2xl font-bold mb-4">Login</h1> {message && <p className="mb-4 text-sm text-red-600">{message}</p>} <form onSubmit={handleSubmit}> <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 mb-2 border rounded" /> <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 mb-2 border rounded" /> <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded"> Login </button> </form> </div> </div> ); };
export default LoginForm;