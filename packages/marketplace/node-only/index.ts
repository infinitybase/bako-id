import dotenv from 'dotenv';

dotenv.config();

export const requireEnv = (env: string): string => {
  const environment = process.env[env];
  if (!environment) {
    throw new Error(`${env} is not set`);
  }
  return environment;
};
