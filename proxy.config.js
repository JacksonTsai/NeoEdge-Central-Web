const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, `./.env`) });

// PROXY_TARGET=https://virtserver.swaggerhub.com
// PROXY_BASE_PATH=/ABOUTSKYGOOOGLE_1/ecv-user/1.0.0
const PROXY_CONFIG = {
  '/api/**': {
    target: process.env.PROXY_TARGET,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/api/v1': '',
      '^/api': ''
    },
    secure: false,
    ws: true,
    cookieDomainRewrite: { '*': 'localhost' }
  }
};

module.exports = PROXY_CONFIG;
