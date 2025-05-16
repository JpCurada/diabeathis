FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies with legacy-peer-deps flag to handle conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Expose port 5173 for Vite dev server
EXPOSE 5173

# Command to run the development server
CMD ["npm", "run", "dev"] 