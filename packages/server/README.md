### server

This is a `trpc` and `fastify` api that is served locally on default port of `3001`. You can start the server by navigating to the `packages/server` folder by running the following command:

```shell
cd packages/server
```

Install the packages by running the following command:

```shell
yarn
```

Then run:

```shell
yarn start
```

When the server has started, make sure that you have a `.env` file in your root directory of the `server` which contains the following:

```shell
JWT_SECRETE = YOURS
COOKIE_SECRETE = YOURS
```

The server is depending on `prisma` so make sure that you generate the `prisma` types, read in the `prisma/README.md`
