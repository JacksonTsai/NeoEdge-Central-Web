const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, `./.env`) });

const PROXY_CONFIG = {
  '/api/*': {
    target: process.env.PROXY_TARGET || 'http://localhost:4200',
    changeOrigin: true,
    pathRewrite: (reqPath) => {
      if (process.env.PROXY_BASE_PATH) {
        if (reqPath.indexOf(process.env.PROXY_BASE_PATH) === -1) {
          return `${process.env.PROXY_BASE_PATH}${reqPath.substring(7)}`;
        }
      }
      return reqPath;
    },
    onProxyRes: (proxyRes) => {
      const sc = proxyRes.headers['set-cookie'];
      if (Array.isArray(sc)) {
        proxyRes.headers['set-cookie'] = sc.map((sc) => {
          return sc
            .split(';')
            .filter((v) => v.trim().toLowerCase() !== 'secure')
            .join('; ');
        });
      }
    },
    secure: false,
    ws: true,
    cookieDomainRewrite: { '*': 'localhost' }
  }
};

module.exports = PROXY_CONFIG;
