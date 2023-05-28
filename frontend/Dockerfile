# Use an official Node.js image as the base
FROM node:14 as build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the source code
COPY . .

# Build the Angular app
RUN npm run build -- --prod

# Use a lightweight Nginx image as the base
FROM nginx:alpine

# Copy the Angular build output to the Nginx public directory
COPY --from=build /usr/src/app/dist/defi /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
