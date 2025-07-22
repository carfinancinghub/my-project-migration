// File: SmartSearchBar.js
// Path: frontend/src/components/chat/SmartSearchBar.js

import React from 'react';

const SmartSearchBar = ({ search, setSearch }) => {
  return (
    <div className="p-3 border-b bg-white">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search messages..."
        className="w-full px-3 py-2 border rounded text-sm"
      />
    </div>
  );
};

export default SmartSearchBar;
