FROM node:slim AS build
WORKDIR /work
COPY . /work
RUN chmod a+x ./dist.sh
RUN npm i
RUN npm run dist

FROM nginx:1.17.5-alpine

COPY --from=build /work/nginx.conf /nginx_conf/nginx.conf
COPY --from=build /work/public/ /usr/share/nginx/html
COPY docker/cmd.sh cmd.sh

VOLUME /data

CMD "./cmd.sh"
