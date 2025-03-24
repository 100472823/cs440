// api-gateway/gateway.js
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

const app = express();

// 1) Serve static files (HTML, CSS, JS) from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// 2) Proxy routes to each microservice
//    /users -> user-service
app.use(
  "/users",
  createProxyMiddleware({
    target: "http://user-service:3001",
    changeOrigin: true,
  })
);
//    /music -> music-service
app.use(
  "/music",
  createProxyMiddleware({
    target: "http://music-service:3002",
    changeOrigin: true,
  })
);
//    /recommendations -> recommendation-service
app.use(
  "/recommendations",
  createProxyMiddleware({
    target: "http://recommendation-service:3003",
    changeOrigin: true,
  })
);

// Start the API Gateway
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
