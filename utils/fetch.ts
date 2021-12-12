import axios, { AxiosRequestConfig } from 'axios';

const productionURL =
  process.env.NODE_ENV === 'production'
    ? 'https://movietest.footballplayers.io'
    : 'http://localhost:8080';

const fetch = (config: AxiosRequestConfig, internalURL = false) => {
  let newConfig = {
    ...config,
  };

  if (internalURL) {
    newConfig = {
      ...config,
      url: `${productionURL}${config.url}`,
    };
  }

  return axios(newConfig);
};

export default fetch;
