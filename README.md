[![build-test](https://github.com/defi-wonderland/interface-exporter-action/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/defi-wonderland/interface-exporter-action/actions/workflows/test.yml)
[![tag badge](https://img.shields.io/github/v/tag/defi-wonderland/interface-exporter-action)](https://github.com/defi-wonderland/interface-exporter-action/tags)
[![license badge](https://img.shields.io/github/license/defi-wonderland/interface-exporter-action)](./LICENSE)

# Interface Exporter Action

Interface Exporter Action automates the process of extracting TypeScript interfaces from Solidity contracts and interfaces and provides compatibility with TypeChain. Developers can seamlessly generate typings with only a few lines of yaml code.

## Action Inputs

| Input        | Description                                                | Default        | Options               |
| ------------ | ---------------------------------------------------------- | -------------- | --------------------- |
| package_name | Chosen name for the exported NPM package                   | **Required**   |                       |
| out          | The path to the directory where contracts are built        | out            |                       |
| interfaces   | The path to the directory where the interfaces are located | src/interfaces |                       |
| contracts    | The path to the directory where the contracts are located  | src/contracts  |                       |
| export_type  | Export option which NPM package will be compatible         | interfaces     | interfaces, contracts |

## Action Outputs

| Output | Description                                              |
| ------ | -------------------------------------------------------- |
| passed | Boolean describing if the action passed correctly or not |

# Usage

## Example

Interface Exporter Action generates NPM packages with your interfaces and contracts ABIs using a matrix of arguments with both and then publishes them to NPM:

```yaml
name: Export And Publish Interfaces And Contracts

on: [push]

jobs:
  export:
    name: Generate Interfaces And Contracts
    runs-on: ubuntu-latest
    strategy:
      matrix:
        export_type: ['interfaces', 'contracts']

    steps:
      - uses: actions/checkout@v3

      - name: Install Foundry
        uses: foundry-rs/foundry-toolchain@v1
        with:
          version: nightly

      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: yarn --frozen-lockfile

      - name: Build project and generate out directory
        run: yarn build

      - name: Update version
        run: yarn version --new-version "0.0.0-${GITHUB_SHA::8}" --no-git-tag-version

      - name: Export Interfaces - ${{ matrix.export_type }}
        uses: defi-wonderland/interface-exporter-action@v1
        with:
          package_name: '@defi-wonderland/interfaces-exporter-action-test-${{ matrix.export_type }}'
          out: 'out'
          interfaces: 'solidity/interfaces'
          contracts: 'solidity/contracts'
          export_type: '${{ matrix.export_type }}'

      - name: Publish
        run: cd export/@defi-wonderland/interfaces-exporter-action-test-${{ matrix.export_type }} && npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

# Development

Install the dependencies

```bash
// Using yarn
yarn

// Using npm
npm install
```

Run the tests

```bash
// Using yarn
yarn test

// Using npm
npm test
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributors

Maintained with love by [Wonderland](https://defi.sucks). Made possible by viewers like you.
