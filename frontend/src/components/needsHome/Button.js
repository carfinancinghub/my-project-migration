// File: Button.js
// Path: frontend/src/components/common/Button.js

import React from 'react';

const Button = ({ children, onClick, disabled, type = 'button', className = '' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 bg-indigo-600 text-white rounded focus:outline-none focus:ring focus:ring-indigo-300 disabled:opacity-50 ${className}`}
    aria-disabled={disabled}
  >
    {children}
  </button>
);

export default Button;


// File: Card.js
// Path: frontend/src/components/common/Card.js

import React from 'react';

const Card = ({ title, children, className = '' }) => (
  <section className={`bg-white border rounded shadow p-4 ${className}`}>  
    {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
    {children}
  </section>
);

export default Card;


// File: Input.js
// Path: frontend/src/components/common/Input.js

import React from 'react';

const Input = ({ label, id, value, onChange, type = 'text', placeholder = '', error = '' }) => (
  <div className="flex flex-col mb-4">
    {label && <label htmlFor={id} className="mb-1 font-medium">{label}</label>}
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border p-2 rounded focus:outline-none focus:ring focus:ring-indigo-300 ${error ? 'border-red-500' : ''}`}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
    />
    {error && <p id={`${id}-error`} className="text-red-600 text-sm mt-1">{error}</p>}
  </div>
);

export default Input;
