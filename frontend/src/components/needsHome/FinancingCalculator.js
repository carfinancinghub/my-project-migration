import React, { useState } from 'react';
import Navbar from './Navbar';

const FinancingCalculator = () => {
  const [price, setPrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('5');
  const [termMonths, setTermMonths] = useState('60');
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [error, setError] = useState('');

  const calculatePayment = () => {
    if (!price || price <= 0) {
      setError('Please enter a valid car price greater than 0');
      setMonthlyPayment(null);
      return;
    }
    if (!downPayment || downPayment < 0 || downPayment >= price) {
      setError('Down payment must be between 0 and the car price');
      setMonthlyPayment(null);
      return;
    }
    if (!interestRate || interestRate <= 0 || interestRate > 100) {
      setError('Interest rate must be between 0 and 100');
      setMonthlyPayment(null);
      return;
    }
    if (!termMonths || termMonths <= 0 || termMonths > 360) {
      setError('Term length must be between 1 and 360 months');
      setMonthlyPayment(null);
      return;
    }

    setError('');

    const loanAmount = price - downPayment;
    const monthlyRate = (interestRate / 100) / 12;
    const payment =
      (loanAmount * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -termMonths));

    if (isNaN(payment) || !isFinite(payment)) {
      setError('Calculation failed. Please check your inputs.');
      setMonthlyPayment(null);
      return;
    }

    setMonthlyPayment(payment.toFixed(2));
  };

  return (
    <div className="financing-calculator">
      <Navbar />
      <div className="max-w-xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-xl font-bold mb-4">💳 Financing Calculator</h2>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="block font-medium">Car Price ($)</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min="0"
              step="1"
            />
          </div>

          <div>
            <label className="block font-medium">Down Payment ($)</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              min="0"
              step="1"
            />
          </div>

          <div>
            <label className="block font-medium">Interest Rate (%)</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 border rounded"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block font-medium">Term Length (Months)</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={termMonths}
              onChange={(e) => setTermMonths(Number(e.target.value))}
              min="1"
              max="360"
            />
          </div>

          <button
            onClick={calculatePayment}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Calculate
          </button>

          {monthlyPayment && (
            <div className="mt-6 text-lg font-semibold">
              Estimated Monthly Payment: <span className="text-green-600">${monthlyPayment}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancingCalculator;