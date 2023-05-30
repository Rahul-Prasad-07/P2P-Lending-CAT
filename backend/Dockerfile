# Use an official Node.js image as the base
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Install the prerequisites to install the web3 and other ethereum npm packages
# RUN apk update && apk upgrade && apk add --no-cache bash git openssh
# RUN apk add --update python krb5 krb5-libs gcc make g++ krb5-dev

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