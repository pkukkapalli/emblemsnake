docker stop drawserver
docker rm drawserver
docker build --tag drawserver:local . || exit 1
docker run --publish 8080:8080 --detach --name drawserver drawserver:local
