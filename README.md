ไหวไหม?

1.

```sh
docker compose up -d
```

2.

```sh
docker exec yuri_s3 mc alias set docker http://localhost:9000 admin password
docker exec yuri_s3 mc mb docker/yuri-chat
docker exec yuri_s3 mc anonymous set public docker/yuri-chat
```

3.

```sh
pnpm i
```

4.

```sh
pnpm prisma migrate dev
pnpm prisma generate
```

5.

```sh
pnpm dev:socket
```
