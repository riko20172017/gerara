# ================= Stage 1: Production =================
FROM node:19-alpine AS production
RUN npm install -g nodemon
WORKDIR /api
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile
COPY . ./
EXPOSE 8000 7000
ARG ENVIRONMENT
ENV ENVIRONMENT=$ENVIRONMENT
CMD ["npm", "run", "start"]