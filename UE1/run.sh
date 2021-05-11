docker container stop $(docker container ls -aq)

docker build -t server .

docker run -d -p 8080:80 server