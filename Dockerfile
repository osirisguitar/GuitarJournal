FROM node:latest

# Copy package.json file to docker image.
ADD package.json /app/

# Define working directory.
WORKDIR /app

# Install node files on docker image.
RUN npm install --production

# Copy application files
ADD ./api /app/api

# Start application
CMD npm start

# Expose port
ENV PORT=5050
EXPOSE 5050