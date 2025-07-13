// File: Card.js
// Path: frontend/src/components/common/Card.js

import React from 'react';
import { theme } from '../../styles/theme';

const Card = ({ children, className = '', ...rest }) => {
  return (
    <div
      className={`bg-white ${theme.cardShadow} ${theme.borderRadius} p-4 ${className}`}
      role="region"
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
