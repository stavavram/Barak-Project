FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY . /usr/share/nginx/html/
COPY ./replaceEnvVars.sh /
RUN chmod +x replaceEnvVars.sh
ENTRYPOINT ["./replaceEnvVars.sh"]
CMD ["nginx", "-g", "daemon off;"]