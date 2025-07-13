import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const AutomationAgent = () => {
const [tasks, setTasks] = useState([]);

useEffect(() => {
axios.get('/api/automation/tasks').then(res => setTasks(res.data));
}, []);

return (

<div> <Navbar /> <div className="p-4"> <h1 className="text-2xl font-bold mb-4">Automation Agent</h1> <div className="grid gap-4"> {tasks.map(task => ( <div key={task._id} className="border p-4 rounded"> <h2 className="text-lg">Task: {task.name}</h2> <p>Status: {task.status}</p> <button className="bg-blue-500 text-white px-4 py-2 rounded">Run Task</button> </div> ))} </div> </div> </div> ); };
export default AutomationAgent;