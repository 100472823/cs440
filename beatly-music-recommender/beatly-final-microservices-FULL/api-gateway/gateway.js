// api-gateway/gateway.js

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

const app = express();

// 1) Servir archivos estáticos (HTML, CSS, JS) desde la carpeta public
app.use(express.static(path.join(__dirname, "public")));

// 2) Proxy para el User Service
//    - Cualquier petición a /users/... se redirige a http://user-service:3001
app.use(
  "/users",
  createProxyMiddleware({
    target: "http://user-service:3001",
    changeOrigin: true,
  })
);

// 3) Proxy para el Music Service
//    - Cualquier petición a /music/... se redirige a http://music-service:3002
app.use(
  "/music",
  createProxyMiddleware({
    target: "http://music-service:3002",
    changeOrigin: true,
  })
);

// 4) Proxy para el Recommendation Service
//    - Cualquier petición a /recommendations/... se redirige a http://recommendation-service:3003
app.use(
  "/recommendations",
  createProxyMiddleware({
    target: "http://recommendation-service:3003",
    changeOrigin: true,
  })
);

// El Gateway escucha en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
