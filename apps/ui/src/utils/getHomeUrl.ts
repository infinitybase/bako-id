const productionUrl = 'https://app.bako.id/';
const developmentUrl = 'http://localhost:5173/';

const environment = import.meta.env.VITE_ENVIRONMENT;

export const getHomeUrl = () => {
    const url =
        environment === 'production' ? productionUrl : developmentUrl;

    return url;
};
