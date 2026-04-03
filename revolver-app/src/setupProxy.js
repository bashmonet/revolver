const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use('/spotify-auth', createProxyMiddleware({
    target: 'https://accounts.spotify.com',
    changeOrigin: true,
    pathRewrite: { '^/spotify-auth': '' },
  }));
  app.use('/spotify-api', createProxyMiddleware({
    target: 'https://api.spotify.com',
    changeOrigin: true,
    pathRewrite: { '^/spotify-api': '' },
  }));
};
