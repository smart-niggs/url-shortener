FROM node:24-slim 
WORKDIR /app
COPY ./ ./
RUN npm ci && npm cache clean --force && npm run build
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
