![Brim CI](https://github.com/brimsec/brim/workflows/Brim%20CI/badge.svg)

# Brim Desktop Application

The desktop app for the Boom backend built with Electron and React.

## Setup

It's expected that `node v12.12.0` and `git` are installed.

```bash
git clone https://github.com/brimsec/brim
cd brim
npm install
npm start
```

Running `npm start` will compile files from `./src` to `./dist` and open the app. When a file is changed, it will recompile it and reload the app.

On subsequent updates, `git pull` then `npm install`.

## Tests

Unit tests use [Jest](https://jestjs.io/) which has an [excellent cli](https://jestjs.io/docs/en/cli). Here are some examples you might use frequently.

```bash
npm test                                      # Run all the tests
npx jest Client.test.js                       # Run a single test file
npx jest Client.test.js -t "increment by one" # Run a single test by name
npx jest --watch                              # Run all tests on every change
```

For integration tests, see [itest/README.md](itest/README.md).

**Snapshots**

Some tests use `expect(result).toMatchSnapshot()`. The first time the test is run, it stores the result in a `.snap` file automatically. Later runs, compare their results to the snapshot. Snapshots can easily be updated with the `-u` command line option.

```bash
npx jest -u # Updates all snapshots with results from this run
```

You can selectively update snapshots by running a single file or test and appending the `-u` option.

```bash
npx jest query.test.js -u # Only updates snapshots used in query.test.js
```

## Pull Requests

Our CI server checks for code format diffs, flow type errors, eslint errors, unit test failures, and integration test failures. You can check all these things locally before pushing your branch.

```bash
npm run format # Prettier formats and saves the project files
npm run lint   # Check eslint
npm run flow   # Check flow
npm test       # Unit tests with jest
npm run itest  # Integration tests with jest & spectron

npm run check  # Runs all the above at once except for itests
```

## Release

```bash
npm run release
```

This creates installers for both Windows and macOS that can be found in `./dist/installers`.

To create a [notarized](https://developer.apple.com/documentation/xcode/notarizing_macos_software_before_distribution) macOS release:

```bash
npm run build
APPLEID_USER=<user> APPLEID_PASSWORD=<app-specific-password> node ./scripts/release --darwin --notarize
```

Where `APPLEID_USER` is the apple ID user name, and `APPLEID_PASSWORD` is an app-specific password created for notarization (details [here](https://developer.apple.com/documentation/xcode/notarizing_macos_software_before_distribution/customizing_the_notarization_workflow)). This will also sign the contents of the package, which requires a [Developer ID](https://developer.apple.com/developer-id/) certificate to be present in your keychain. 

Notarization can take some time to complete ("typically less than an hour"). If you want to check on the status of the notarization request, run:

```bash
xcrun altool --notarization-history 0 -u <user> -p <app-specific-password>
```

