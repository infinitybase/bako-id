// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';

export const Warning = ({ children }) => {
  return (
    <div
      style={{
        padding: '1em',
        color: '#ffc010',
        border: '1px solid #ffc01026',
        backgroundColor: '#ffc0100d',
        borderRadius: '5px',
      }}
    >
      ⚠️ IMPORTANT: {children}
    </div>
  );
};
