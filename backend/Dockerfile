FROM node:20-alpine

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Run DB migrations/seeds if needed (optional)
# RUN npm run migrate

EXPOSE 3001

# Run migrations and start backend server
CMD ["sh", "-c", "npm run migrate && npm start"]
    