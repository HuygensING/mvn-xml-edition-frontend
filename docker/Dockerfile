FROM node:slim AS build
WORKDIR /work
COPY . /work
RUN npm i && npm run dist

FROM nginx:1.17.5-alpine
COPY --from=build /work/nginx.conf /nginx_conf/nginx.conf
COPY --from=build /work/public/ /usr/share/nginx/html
CMD ["nginx", "-c", "/nginx_conf/nginx.conf", "-g", "daemon off;"]