ARG PORT=8000

FROM node:19-alpine as development
RUN npm install -g nodemon
WORKDIR /api
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile
COPY . ./
EXPOSE $PORT 7000
CMD ["npm", "run", "dev"]

FROM node:19-alpine as production
RUN npm install -g nodemon
WORKDIR /api
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile
COPY . ./
EXPOSE $PORT 7000
CMD ["npm", "run", "start"]