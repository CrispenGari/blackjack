### prisma

This is a folder that contains the database schema which can be configured. I'm using `mongodb` for database so you need to tell prisma about that. Create a `.env` file in the `root` folder of the project `bLackjack` it should have a `DATABASE_URL` which is a url to your mongodb database

```shell
DATABASE_URL = YOURS
```

Navigate to prisma by running the following command:

```shell
cd prisma
```

Then run:

```shell
npx prisma generate
```
