ARG PORT=8000

FROM node:19-alpine as development
RUN npm install -g nodemon
WORKDIR /api
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile
COPY . ./
EXPOSE $PORT 7000
ENV BROKER_IP=185.221.155.147
CMD ["npm", "run", "dev"]

FROM node:19-alpine as production
RUN npm install -g nodemon
WORKDIR /api
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile
COPY . ./
EXPOSE $PORT 7000
ENV BROKER_IP=broker
CMD ["npm", "run", "start"]