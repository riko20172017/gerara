ARG PORT=8000

FROM node:19-alpine as development
RUN npm install -g nodemon
WORKDIR /api
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
EXPOSE $PORT
CMD ["npm", "run", "dev"]

FROM node:19-alpine as production
RUN npm install -g nodemon
WORKDIR /api
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
EXPOSE $PORT
CMD ["npm", "run", "start"]