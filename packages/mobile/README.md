### mobile

This is a mobile app for the game called `blackjack` you can start the mobile app independently first you need to install the packages by navigating to the `packages/mobile`:

```shell
cd packages/mobile
```

Then install the packages by running the following command:

```shell
yarn
```

After that you can start the mobile app by running the following command:

```shell
yarn start
```

> Note that you need to open the `package/mobile/src/constants/index.ts` and change the `engrokDomain` to your hosted domain of the `server` package or you can create an instance an `ngrok` server on your machine by running the following command:

```shell
ngrok http 3001
```

> Note that you may need to have `ngrok` installed on your computer and `3001` is the port of the `server`.
