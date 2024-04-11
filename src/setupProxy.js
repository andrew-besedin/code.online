const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        ['/api', '/socket.io'],
        createProxyMiddleware({
            target: 'http://localhost:3033',
            changeOrigin: true,
        })
    );
};