# syntax=docker/dockerfile:1

# ---------- Build stage ----------
FROM node:24-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -f /etc/nginx/conf.d/default.conf.default

COPY --from=build /app/dist/ /usr/share/nginx/html/

EXPOSE 4203

CMD ["nginx", "-g", "daemon off;"]
