import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const LoanComparison = () => {
const [loans, setLoans] = useState([]);

useEffect(() => {
axios.get('/api/loans/compare').then(res => setLoans(res.data));
}, []);

return (

<div> <Navbar /> <div className="p-4"> <h1 className="text-2xl font-bold mb-4">Loan Comparison</h1> <div className="grid gap-4"> {loans.map(loan => ( <div key={loan._id} className="border p-4 rounded"> <h2 className="text-lg">{loan.lender}</h2> <p>Amount: ${loan.amount}</p> <p>Rate: {loan.rate}%</p> <p>Term: {loan.term} months</p> <button className="bg-blue-500 text-white px-4 py-2 rounded">Apply</button> </div> ))} </div> </div> </div> ); };
export default LoanComparison;