import axios, { AxiosRequestConfig } from 'axios';

const productionURL = process.env.NODE_ENV === 'production'
  ? 'https://api.tmrev.io'
  : 'http://localhost:8080';

const fetch = (config: AxiosRequestConfig, internalURL = false) => {
  let newConfig = {
    ...config,
  };

  if (internalURL) {
    newConfig = {
      ...config,
      url: `https://api.tmrev.io${config.url}`,
    };
  }

  return axios(newConfig);
};

export default fetch;
