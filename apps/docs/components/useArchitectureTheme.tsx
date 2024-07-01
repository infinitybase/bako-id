import { useTheme } from 'nextra-theme-docs';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';

export const ThemeSmartContractsImage = () => {
  const { theme } = useTheme();

  return (
    <img
      style={{
        marginTop: '2rem',
      }}
      src={
        theme && theme === 'dark'
          ? '/contracts-grapqh.png'
          : '/contracts-grapqh-light.png'
      }
      alt="smart contracts"
    />
  );
};

export const RegisterMethodTheme = () => {
  const { theme } = useTheme();

  return (
    <img
      style={{
        marginTop: '2rem',
      }}
      src={
        theme && theme === 'dark'
          ? '/register-example.svg'
          : '/register-example-light.png'
      }
      alt="register method"
    />
  );
};

export const ResolverMethodTheme = () => {
  const { theme } = useTheme();

  return (
    <img
      style={{
        marginTop: '2rem',
      }}
      src={
        theme && theme === 'dark'
          ? '/resolver-example.svg'
          : '/resolver-example-light.png'
      }
      alt="resolver method"
    />
  );
};
