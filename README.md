# Kelas Rumah Berbagi

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![Build Status][build-badge]][build] [![MIT License][license-badge]][license]

<!-- prettier-ignore-start -->

[build-badge]: https://img.shields.io/github/workflow/status/zainfathoni/kelas.rumahberbagi.com/CI?logo=github&style=flat-square
[build]: https://github.com/zainfathoni/kelas.rumahberbagi.com/actions?query=workflow%3ACI
[license-badge]: https://img.shields.io/badge/license-MIT-blue?style=flat-square
[license]: LICENSE

<!-- prettier-ignore-end -->

Online course platform for Rumah Berbagi.

- [Kelas Rumah Berbagi](#kelas-rumah-berbagi)
  - [Documentation](#documentation)
  - [Getting started](#getting-started)
    - [System Requirements](#system-requirements)
    - [Development](#development)
    - [Testing](#testing)
  - [Tools & References](#tools--references)
    - [Tools](#tools)
      - [Code Editor](#code-editor)
    - [References](#references)
  - [Frequently Used Commands](#frequently-used-commands)
    - [Prisma commands](#prisma-commands)
    - [PlanetScale commands](#planetscale-commands)
    - [Fly Setup ⚠️ Warning, the deployment setup is untested yet ⚠️](#fly-setup-️-warning-the-deployment-setup-is-untested-yet-️)
    - [Deployment](#deployment)
  - [Contributing](#contributing)
    - [Important links](#important-links)
  - [Contributors ✨](#contributors-)

## Documentation

- [Main Docs](docs/index.md)
- [Hackathon Announcement](https://rbagi.id/gh/22)

## Getting started

### System Requirements

- [Node.js](https://nodejs.org/) >= 16.0.0
- [git](https://git-scm.com/) >= 2.7.0

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

Then go to the directory and copy the example environment variables into an
ignored `.env` file

```sh
cd kelas.rumahberbagi.com
cp .env.example .env
```

Run this command to perform the initial setup while making sure that the app can
run properly in your local.

```sh
npm run setup
```

Finally, run the development server to start developing.

```sh
npm run dev
```

Open <http://localhost:3000> with your browser to see the result. This starts
your app in development mode, rebuilding assets on file changes.

### Testing

Run this command to start the end-to-end testing locally.

```sh
npm run test:e2e:run
```

Here's what that script does (along with the corresponding NPM commands):

1. It builds the app (`npm run build`)
2. It starts the server using the test database (`npm run start:e2e`)
3. After <http://localhost:3000/> is available, it starts testing (`npm t`
   a.k.a. `npm test` a.k.a. `npm run test`)

If you want, you can also manually run those commands above.

## Tools & References

### Tools

- [Commitlint.io](https://commitlint.io)
- [Tailwind UI](https://tailwindui.com/)
- [Testing Playground](https://testing-playground.com/)

#### Code Editor

If you're using Visual Studio Code, you can install the recommended extensions
for this project by
[using `@recommended` filter](https://code.visualstudio.com/docs/editor/extension-marketplace#_extensions-view-filters).

![Recommended VS Code Extensions](https://user-images.githubusercontent.com/6315466/147128206-3b1acdaa-213f-4e2b-a0a3-4b8c63bc881d.png)

### References

- [Remix Docs](https://remix.run/docs)
- [Tailwind CSS](https://tailwindcss.com/)

## Frequently Used Commands

### Prisma commands

Learn more about this [Prisma schema file](prisma/schema.prisma) in the docs:
<https://pris.ly/d/prisma-schema>

Commands to know:

- `npx prisma generate` - update TypeScript definitions based on this schema
- `npx prisma db push` - push the schema changes to the database
- `npx prisma studio` - open the Studio, which allows you to edit the schema.
- `npx prisma migrate reset` - reset the migrations to the last version. This
  will reset the DB and run the seed script
- `npx prisma migrate dev --name <descriptive-name>` - generate a migration file
  for any changes you make to the schema (this will be committed).

### PlanetScale commands

Learn more about Planetscale CLI in the docs:
<https://docs.planetscale.com/reference/planetscale-cli>

Commands to know:

- `pscale connect <DATABASE_NAME> <BRANCH_NAME> --port 3309` - create a secure
  connection to a database branch for a local client
- `pscale database dump <DATABASE_NAME> <BRANCH_NAME> --output <DIR_NAME>` -
  backup and dump the specified database

### Fly Setup ⚠️ Warning, the deployment setup is untested yet ⚠️

1. [Install Fly](https://fly.io/docs/getting-started/installing-flyctl/)

2. Sign up and log in to Fly

   ```sh
   flyctl auth signup
   ```

3. Setup Fly. It might ask if you want to deploy, say no since you haven't built
   the app yet.

   ```sh
   flyctl launch
   ```

### Deployment

If you've followed the setup instructions already, all you need to do is run
this:

```sh
npm run deploy
```

You can run `flyctl info` to get the url and ip address of your server.

Check out the [fly docs](https://fly.io/docs/getting-started/node/) for more
information.

## Contributing

See our contribution guidelines in these languages:

- [English](CONTRIBUTING.md)
- [Indonesian](CONTRIBUTING_ID.md)

When contributing to our project, please use English when communicating with
other people in issues and/or pull requests.
[Click here](CONTRIBUTING.md#why-are-we-using-english-in-our-issues--prs) to
read why.
([Bahasa Indonesia](CONTRIBUTING_ID.md#mengapa-kita-menggunakan-bahasa-inggris-dalam-menulis-issue-dan-pull-request))

### Important links

<!-- markdownlint-disable line-length -->

| Description                  | Link                                                       |
| ---------------------------- | ---------------------------------------------------------- |
| Project overview             | [rbagi.id/github-project](https://rbagi.id/github-project) |
| Epics list                   | [rbagi.id/epic](https://rbagi.id/epic)                     |
| Issues board                 | [rbagi.id/board](https://rbagi.id/board)                   |
| Issue shortlink              | [rbagi.id/gh/:issue-id](https://rbagi.id/gh)               |
| First-time contributors link | [rbagi.id/contribute](https://rbagi.id/contribute)         |

<!-- markdownlint-restore -->

## Contributors ✨

Thanks goes to these wonderful people
([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://zainf.dev"><img src="https://avatars.githubusercontent.com/u/6315466?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Zain Fathoni</b></sub></a><br /><a href="https://github.com/zainfathoni/kelas.rumahberbagi.com/commits?author=zainfathoni" title="Code">💻</a> <a href="https://github.com/zainfathoni/kelas.rumahberbagi.com/commits?author=zainfathoni" title="Documentation">📖</a> <a href="#design-zainfathoni" title="Design">🎨</a> <a href="#maintenance-zainfathoni" title="Maintenance">🚧</a> <a href="#tool-zainfathoni" title="Tools">🔧</a> <a href="https://github.com/zainfathoni/kelas.rumahberbagi.com/commits?author=zainfathoni" title="Tests">⚠️</a> <a href="#projectManagement-zainfathoni" title="Project Management">📆</a> <a href="#ideas-zainfathoni" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="http://retry19.com"><img src="https://avatars.githubusercontent.com/u/39640211?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Reza Rachmanuddin</b></sub></a><br /><a href="https://github.com/zainfathoni/kelas.rumahberbagi.com/issues?q=author%3Aretry19" title="Bug reports">🐛</a> <a href="https://github.com/zainfathoni/kelas.rumahberbagi.com/commits?author=retry19" title="Code">💻</a> <a href="https://github.com/zainfathoni/kelas.rumahberbagi.com/commits?author=retry19" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/febrifahmi"><img src="https://avatars.githubusercontent.com/u/12995919?v=4?s=100" width="100px;" alt=""/><br /><sub><b>febrifahmi</b></sub></a><br /><a href="https://github.com/zainfathoni/kelas.rumahberbagi.com/commits?author=febrifahmi" title="Code">💻</a></td>
    <td align="center"><a href="https://guntoroyk.com/"><img src="https://avatars.githubusercontent.com/u/24248495?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Guntoro Yudhy Kusuma</b></sub></a><br /><a href="https://github.com/zainfathoni/kelas.rumahberbagi.com/commits?author=guntoroyk" title="Code">💻</a></td>
    <td align="center"><a href="http://nurfitrapujo.vercel.app"><img src="https://avatars.githubusercontent.com/u/26681203?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nurfitra Pujo Santiko</b></sub></a><br /><a href="https://github.com/zainfathoni/kelas.rumahberbagi.com/commits?author=NurfitraPujo" title="Code">💻</a> <a href="https://github.com/zainfathoni/kelas.rumahberbagi.com/commits?author=NurfitraPujo" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the
[all-contributors](https://github.com/all-contributors/all-contributors)
specification. Contributions of any kind welcome!
