import { useTheme } from 'nextra-theme-docs';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';

export const ThemeMetadataImage = () => {
  const { theme } = useTheme();

  return (
    <img
      style={{
        marginTop: '2rem',
      }}
      src={
        theme && theme === 'dark'
          ? '/metadata-flow.png'
          : '/metadata-flow-light.png'
      }
      alt="metadata"
    />
  );
};
