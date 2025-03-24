# api-gateway/Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy everything including gateway.js, public folder, etc.
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
