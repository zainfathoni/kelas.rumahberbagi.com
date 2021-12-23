# Kelas Rumah Berbagi

Online course platform for Rumah Berbagi.

[![Build Status][build-badge]][build]
[![MIT License][license-badge]][license]

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

Then go to the directory and copy the example environment variables into an ignored `.env` file

```sh
cd kelas.rumahberbagi.com
cp .env.example .env
```

Run this command to perform the initial setup while making sure that the app can run properly in your local.

```sh
npm run setup
```

Finally, run the development server to start developing.

```sh
npm run dev
```

Open <http://localhost:3000> with your browser to see the result.
This starts your app in development mode, rebuilding assets on file changes.

### Testing

Run this command to start the end-to-end testing locally.

```sh
npm run test:e2e:run
```

Here's what that script does (along with the corresponding NPM commands):

1. It builds the app (`npm run build`)
2. It starts the server using the test database (`npm run start:e2e`)
3. After <http://localhost:3000/> is available, it starts testing (`npm t` a.k.a. `npm test` a.k.a. `npm run test`)

If you want, you can also manually run those commands above.

## Tools & References

### Tools

- [Commitlint.io](https://commitlint.io)
- [Tailwind UI](https://tailwindui.com/)
- [Testing Playground](https://testing-playground.com/)

#### Code Editor

If you're using Visual Studio Code, you can install the recommended extensions for this project by [using `@recommended` filter](https://code.visualstudio.com/docs/editor/extension-marketplace#_extensions-view-filters).

![Recommended VS Code Extensions](https://user-images.githubusercontent.com/6315466/147128206-3b1acdaa-213f-4e2b-a0a3-4b8c63bc881d.png)

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

[build-badge]: https://img.shields.io/github/workflow/status/zainfathoni/kelas.rumahberbagi.com/CI?logo=github
[build]: https://github.com/zainfathoni/kelas.rumahberbagi.com/actions?query=workflow%3ACI
[license-badge]: https://img.shields.io/badge/license-MIT-blue
[license]: LICENSE

<!-- prettier-ignore-end -->
