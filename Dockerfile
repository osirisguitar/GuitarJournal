FROM node:latest

# Copy package.json file to docker image.
COPY package.json /app/

# Define working directory.
WORKDIR /app

# Install node files on docker image.
RUN npm install --production

# Copy application files
COPY ./app.js /app/
COPY ./app /app/app
COPY ./about /app/about
COPY ./api /app/api
COPY ./admin /app/admin

# Start application
CMD npm start

# Expose port
EXPOSE 80
