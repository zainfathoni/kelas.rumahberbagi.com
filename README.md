# Kelas Rumah Berbagi

Online course platform for Rumah Berbagi.

![CI][ci-badge]

## Getting started

### Development

To get started running the project locally, please follow the steps below.

First, clone the repository.

```sh
git clone https://github.com/zainfathoni/kelas.rumahberbagi.com.git
```

or if you're cloning using SSH.

```sh
git clone git@github.com:zainfathoni/kelas.rumahberbagi.com.git
```

Then, install dependencies and fetch data to your local machine.

```sh
cd kelas.rumahberbagi.com
npm install
```

Copy the example environment variables into an ignored `.env` file

```sh
cp .env.example .env
```

Finally, run the development server.

```bash
npm run dev
```

Open <http://localhost:3000> with your browser to see the result.
This starts your app in development mode, rebuilding assets on file changes.

### Testing

TBD

## Tools & References

### Tools

- [Commitlint.io](https://commitlint.io)
- [Tailwind UI](https://tailwindui.com/)
- [Testing Playground](https://testing-playground.com/)

### Documentation

- [Remix Docs](https://remix.run/docs)
- [Tailwind CSS](https://tailwindcss.com/)

## Frequently Used Commands

### Prisma commands

Learn more about this [Prisma schema file](prisma/schema.prisma) in the docs: <https://pris.ly/d/prisma-schema>

Commands to know:

- `npx prisma generate` - update TypeScript definitions based on this schema
- `npx prisma db push` - push the schema changes to the database
- `npx prisma studio` - open the Studio, which allows you to edit the schema.
- `npx prisma migrate reset` - reset the migrations to the last version. This will reset the DB and run the seed script
- `npx prisma migrate dev --name <descriptive-name>` - generate a migration file for any changes you make to the schema (this will be committed).

### Fly Setup ⚠️ Warning, the deployment setup is untested yet ⚠️

1. [Install Fly](https://fly.io/docs/getting-started/installing-flyctl/)

2. Sign up and log in to Fly

   ```sh
   flyctl auth signup
   ```

3. Setup Fly. It might ask if you want to deploy, say no since you haven't built the app yet.

   ```sh
   flyctl launch
   ```

### Deployment

If you've followed the setup instructions already, all you need to do is run this:

```sh
npm run deploy
```

You can run `flyctl info` to get the url and ip address of your server.

Check out the [fly docs](https://fly.io/docs/getting-started/node/) for more information.

## Contributing

See our contribution guidelines in these languages:

- [English](CONTRIBUTING.md)
- [Indonesian](CONTRIBUTING_ID.md)

When contributing to our project, please use English when communicating with other people in issues and/or pull requests. [Click here](CONTRIBUTING.md#why-are-we-using-english-in-our-issues--prs) to read why. ([Bahasa Indonesia](CONTRIBUTING_ID.md#mengapa-kita-menggunakan-bahasa-inggris-dalam-menulis-issue-dan-pull-request))

<!-- prettier-ignore-start -->

[ci-badge]: https://github.com/zainfathoni/kelas.rumahberbagi.com/actions/workflows/test.yml/badge.svg

<!-- prettier-ignore-end -->
