docker stop emblemsnake
docker rm emblemsnake
docker build --tag emblemsnake:local . || exit 1
docker run --publish 8080:8080 --detach --name emblemsnake emblemsnake:local
