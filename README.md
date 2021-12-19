# Kelas Rumah Berbagi

![CI](https://github.com/zainfathoni/kelas.rumahberbagi.com/actions/workflows/test.yml/badge.svg)

- [Remix Docs](https://remix.run/docs)

## Prisma commands

Learn more about this [Prisma schema file](prisma/schema.prisma) in the docs: <https://pris.ly/d/prisma-schema>

Commands to know:

- `npx prisma generate` - update TypeScript definitions based on this schema
- `npx prisma db push` - push the schema changes to the database
- `npx prisma studio` - open the Studio, which allows you to edit the schema.
- `npx prisma migrate reset` - reset the migrations to the last version. This will reset the DB and run the seed script
- `npx prisma migrate dev --name <descriptive-name>` - generate a migration file for any changes you make to the schema (this will be committed).

## Fly Setup

1. [Install Fly](https://fly.io/docs/getting-started/installing-flyctl/)

2. Sign up and log in to Fly

    ```sh
    flyctl auth signup
    ```

3. Setup Fly. It might ask if you want to deploy, say no since you haven't built the app yet.

    ```sh
    flyctl launch
    ```

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

If you've followed the setup instructions already, all you need to do is run this:

```sh
npm run deploy
```

You can run `flyctl info` to get the url and ip address of your server.

Check out the [fly docs](https://fly.io/docs/getting-started/node/) for more information.
