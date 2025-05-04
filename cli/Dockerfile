ARG PORT=3000

# Stage 1: Build the React app
FROM node:18-alpine AS production
WORKDIR /cli
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile && npm cache clean --force
COPY . ./
ENV REACT_APP_API_IP=185.221.155.147
ENV REACT_APP_API_PORT=8000
RUN npm run build

# Stage 2: Development environment -------------------------------------------
FROM node:18-alpine AS development
WORKDIR /cli
# Install dependencies again for development
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile
COPY . ./
EXPOSE $PORT
ENV REACT_APP_API_IP=127.0.0.1
ENV REACT_APP_API_PORT=8000
CMD ["npm", "start"]

# Stage 3: Production environment --------------------------------
# FROM nginx:alpine AS production
# COPY --from=build /cli/build /usr/share/nginx/html
# EXPOSE $PORT
# CMD ["nginx", "-g", "daemon off;"]

# FROM wordpress AS production
# COPY --from=build /cli/build/static /var/www/html/wp-content/plugins/gerarareact