ARG RUNTIME_IMAGE=m.daocloud.io/docker.io/library/nginx:1.27-alpine
FROM ${RUNTIME_IMAGE}

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
