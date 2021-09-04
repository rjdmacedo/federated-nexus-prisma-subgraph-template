# Federated Subgraph using Prisma and Nexus
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)](https://paypal.me/rjdmacedo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![renovate badge](https://img.shields.io/badge/maintaied%20with-renovate-blue?logo=renovatebot)](https://app.renovatebot.com/dashboard)

This starter project makes creating [Apollo Federated](https://www.apollographql.com/docs/federation/) subgraphs with [Prisma.io](https://www.prisma.io/) and [GraphQL Nexus](https://nexusjs.org/) a breeze.

### Usage

![](https://i.imgur.com/opUmHp0.png)

### Usage

```bash
git clone https://github.com/RafaelMLMacedo/federated-nexus-prisma-subgraph-template.git YOUR_FOLDER_NAME
cd YOUR_FOLDER_NAME

yarn install
```

#### Create a `.env` and a `prisma.env`

```bash
$ cp .env.example .env
$ cp prisma/.env.example prisma/.env
```

**Start coding!** `package.json` and entry files are already set up for you, so don't worry about linking to your main file, typings, etc. Just keep those files with the same name.

### Features

- Zero-setup. After running `yarn install` things will set up for you 😉
- **[Postgres](https://www.postgresql.org/)** database out of the box
- Tests, coverage and interactive watch mode using **[Jest](http://facebook.github.io/jest/)**
- **[Prettier](https://github.com/prettier/prettier)** and **[TSLint](https://palantir.github.io/tslint/)** for code formatting and consistency
- **Docs automatic generation and deployment** to `gh-pages`, using **[TypeDoc](http://typedoc.org/)**
- Automatic types `(*.d.ts)` file generation
- `docker-compose.yml` deploys a postgres database to persist your development data without hassle.
- Using **[Commitizen](https://github.com/commitizen/cz-cli)** and **[Husky](https://github.com/typicode/husky)** (for the git hooks)

### NPM scripts

- `yarn preinstall`: Checks if you're using yarn or NPM. If you're using NPM, an error is thrown
- `yarn prepare`: Installs ([husky](https://github.com/typicode/husky) hooks)
- `yarn clean`: Deletes the `./generated` folder
- `yarn lint`: Lints the code to improve consistency
- `yarn build`: Deletes the `./generated` folder, generates Prisma and Nexus typings and executes the TypeScript `tsc`
- `yarn dev`: Starts a server on port `4001` (if no other value for `SERVER_PORT` is provided on `./.env` file)
- `dev:type:check`: Checks for TypeScript errors on the fly, watching you're changes.
- `yarn database:compose`: Runs the `docker-compose up -d` that deploys the `postgres` database
- `yarn prisma:migrate`: Create migrations from your Prisma schema, apply them to the database, generate artifacts (e.g. Prisma Client)
- `yarn prisma:deploy`: If there are any changes locally and the database, prisma will deploy your changes to the database.
- `yarn generate`: Generates Prisma artifacts and 
- `yarn test`: **[Jest](http://facebook.github.io/jest/)** runs your `*.(spec|test).(ts|tsx|js)` as the chosen suite to develop with confidence.

### Semantic commits 🚓

From now on, you'll need to use `npm run commit`, which is a convenient way to create conventional commits.

Follow [conventional commit messages](https://github.com/conventional-changelog/conventional-changelog)

### Git Hooks 🎣

There is already set a `pre-commit` hook for formatting your code with Prettier 💅

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
