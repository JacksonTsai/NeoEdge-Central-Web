const path = require('path');
const dotenv = require('dotenv');
const { log } = require('console');

dotenv.config({ path: path.join(__dirname, `./.env`) });

const PROXY_CONFIG = {
  '/api/**': {
    target: process.env.PROXY_TARGET,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {},
    secure: false,
    ws: true,
    headers: { origin: process.env.HEADER_ORIGIN ? process.env.HEADER_ORIGIN : 'localhost:80' },
    cookieDomainRewrite: { '*': 'localhost' }
  },
  '/neoedgex/advanced_app/texol/device_profile/**': {
    target: process.env.DOC_PROXY_TARGET,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {},
    secure: false,
    ws: true,
    headers: { origin: process.env.HEADER_ORIGIN ? process.env.HEADER_ORIGIN : '' },
    cookieDomainRewrite: { '*': 'localhost' }
  }
};

module.exports = PROXY_CONFIG;
