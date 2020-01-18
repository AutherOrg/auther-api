# Blockcerts API

API to host and share online [Blockcerts](https://www.blockcerts.org) certificates.

## Introduction

**blockcerts-ethereum-api** is an opensource API to host and share online Blockcerts certificates.

This project is purely a backend server. It's intended to be best used with the [Blockcerts Ethereum client](https://github.com/guix77/blockcerts-ethereum-client) project.

*This application has been originally developed with financial support by GIZ Lab as a component of a project with [GIZ](https://www.giz.de/en/html/index.html) (Deutsche Gesellschaft für Internationale Zusammenarbeit GmbH) and [SEAMEO INNOTECH](https://www.seameo-innotech.org/) (Regional Center for Educational Innovation and Technology, Southeast Asian Ministers of Education Organization).*

## Installation

### Requirements

+ Node.js (this project is developed with Node.js version 13 but many older versions should work).
+ A MySql or MariaDb database

````
yarn install
cp .env.example .env
````

*If you don't have yarn, you can use npm instead.*

Edit .env to set your credentials and then launch the server:

````
yarn start
````

At the first launch, the DB structure will be created.

Then, in order to keep the DB each time the server restarts, you must stop the server, edit .env to set DB_SYNC=0 and relaunch the server.

To sign certificates, you will need to have Ethereum connectivity in your browser. You can for instance install the [Metamask](https://metamask.io/) extension (Firefox + Chrome). Also, you will need to have a little bit of Ether. On the Ethereum testnet Ropsten, you can have some for free. On Ethereum Mainnet, on which you should issue real certificates, it won't even cost $0.01 to issue a batch of up to thousands certificates.

## Issues

Please report issues [here](https://github.com/guix77/blockcerts-api/issues).

## General discussion

Please post on the [Blockcerts.org forum topic](https://community.blockcerts.org/t/TODO).

## Development

Please read the [contribution guidelines](CONTRIBUTING.md).

## Credits

### Developers

+ Guillaume Duveau, freelance blockchain & web developer, original author of this [Blockcerts](https://guillaumeduveau.com/en/blockcerts) API

### Partners

+ [GIZ](https://www.giz.de/en/html/index.html) (Deutsche Gesellschaft für Internationale Zusammenarbeit GmbH)
+ [SEAMEO INNOTECH](https://www.seameo-innotech.org/) (Regional Center for Educational Innovation and Technology, Southeast Asian Ministers of Education Organization)
