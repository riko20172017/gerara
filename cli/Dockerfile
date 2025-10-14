ARG PORT=3000

# ================= Stage 1: Dependencies =================
FROM node:18-alpine AS deps
WORKDIR /cli
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

# Stage 2: Build the React app
FROM node:18-alpine AS build
WORKDIR /cli
COPY --from=deps /cli/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
ENV REACT_APP_API_IP=185.221.155.147
ENV REACT_APP_API_PORT=8000
RUN npm run build

# Stage 3: Production environment --------------------------------
FROM nginx:alpine AS production
COPY --from=build /cli/build /usr/share/nginx/html
EXPOSE $PORT
CMD ["nginx", "-g", "daemon off;"]