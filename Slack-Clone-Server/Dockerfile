# select node version
FROM node:11

# especify working directory
WORKDIR /app

# copy package.json files
COPY package-lock.json .
COPY package.json .

# install all of the dependencies
RUN npm install

# copy the contents of the dist folder
COPY dist .

# run index.js file to start up the server
CMD node index.js