# Stage 1: Build
FROM node:22.14.0-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@latest
COPY . .
RUN npm run build

# Stage 2: Run
FROM nginx:alpine
LABEL author="Mario Gruda"
VOLUME /var/cache/nginx
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]