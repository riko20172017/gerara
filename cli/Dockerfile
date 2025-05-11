ARG PORT=3000

# ================= Stage 1: Dependencies =================
FROM node:18-alpine AS deps
WORKDIR /cli
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

# Stage 2: Development environment -------------------------------------------
FROM node:18-alpine AS development
WORKDIR /cli
COPY --from=deps /cli/node_modules ./node_modules
COPY . ./
EXPOSE $PORT
ENV REACT_APP_ENV=development
ENV REACT_APP_API_IP=127.0.0.1
ENV REACT_APP_API_PORT=8000
ENV REACT_APP_STATIC_PATH="/img"
CMD ["npm", "start"]

# Stage 1: Build the React app
FROM node:18-alpine AS build
WORKDIR /cli
COPY --from=deps /cli/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
ENV REACT_APP_API_IP=185.221.155.147
ENV REACT_APP_API_PORT=8000
ENV REACT_APP_STATIC_PATH="/wp-content/plugins/gerarareact/frontend/img"
RUN npm run build

# Stage 3: Minimal production environment
FROM node:18-alpine AS production
COPY ./entrypoint.sh /entrypoint.sh
COPY --from=build /cli/build /build
RUN chmod +x /entrypoint.sh
VOLUME /cli
ENTRYPOINT ["/entrypoint.sh"]
CMD ["sleep", "3600"]


# Stage 3: Production environment --------------------------------
# FROM nginx:alpine AS production
# COPY --from=build /cli/build /usr/share/nginx/html
# EXPOSE $PORT
# CMD ["nginx", "-g", "daemon off;"]