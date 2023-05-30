# Use a base image with Node.js and npm pre-installed
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the compiled smart contract artifacts
COPY ./artifacts ./artifacts

# Set the entry point command or script to run your application
CMD [ "npx", "hardhat", "compile" ]