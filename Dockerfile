# Official lightweight Nginx image
FROM nginx:alpine

# Copy website files into Nginx's web directory
COPY index.html style.css script.js /usr/share/nginx/html/

# Nginx listens on port 80 inside the container
EXPOSE 80
