# Use an official Node.js image as the base
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the Node.js server
CMD ["npm", "start"]
