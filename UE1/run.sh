docker container stop $(docker container ls -aq)

docker build -t server .

docker run -d -p 8081:80 server