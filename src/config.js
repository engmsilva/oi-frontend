const selectEnv = process.env.REACT_APP_ENV;

const development = {
  URL_API: 'http://localhost:5000/',
  REACT_APP_CAPTCHA: process.env.REACT_APP_CAPTCHA_DEV
};

const production = {
  URL_API: 'http://my-api.com/api',
  REACT_APP_CAPTCHA: process.env.REACT_APP_CAPTCHA
};

const URL = {
  development: () => development,
  production: () => production,
};

const CONFIG = URL[selectEnv]();

export default CONFIG;