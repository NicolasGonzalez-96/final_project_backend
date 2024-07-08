# official node runtime
FROM node:22

# working directory
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# move the codebase to the container
COPY . .

# exposing port
EXPOSE 3456

CMD ["node", "index.js"]
