# ================= Stage 1: Production =================
FROM nginx:1.15.12-alpine AS production
COPY nginx-conf-local/ /etc/nginx/conf.d/
EXPOSE 80 443