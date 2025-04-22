#!/bin/zsh

docker exec yuri_s3 mc alias set docker http://localhost:9000 admin password
docker exec yuri_s3 mc mb docker/yuri-chat
docker exec yuri_s3 mc anonymous set public docker/yuri-chat