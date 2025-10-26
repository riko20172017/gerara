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
ARG ENVIRONMENT
ENV NODE_ENV=production
ENV REACT_APP_ENV=$ENVIRONMENT
RUN npm run build

# Stage 3: Production environment --------------------------------
FROM nginx:alpine AS production
COPY --from=build /cli/build /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]