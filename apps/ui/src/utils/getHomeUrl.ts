const productionUrl = 'https://app.bako.id/';
const developmentUrl = 'http://localhost:5173/';

const isDev = import.meta.env.DEV;

export const getHomeUrl = () => {
  return isDev ? developmentUrl : productionUrl;
};
