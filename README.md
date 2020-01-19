# OpenBlockcerts API

API to host and share online [Blockcerts](https://www.blockcerts.org) certificates.

## Introduction

**OpenBlockcerts API** is an opensource API to host and share online Blockcerts certificates.

This project is purely a backend server. It's intended to be best used with the [OpenBlockcerts client](https://github.com/openblockcerts/openblockcerts-client) project.

## Requirements

+ Node.js (this project is developed with Node.js version 13 but many older versions should work).
+ A MySql or MariaDb database

## Installation

````
yarn install
cp .env.example .env
cp src/seeders/1_users.seed.js.example src/seeders/1_users.seed.js
````

*If you don't have yarn, you can use npm instead.*

Edit .env to set your credentials and src/seeders/1_users.seed.js to set the administrator account.

Init the database:

````
yarn set
````

Start the server (development mode):

````
yarn start
````

## Sign certificates

To sign certificates, you will need to have Ethereum connectivity in your browser. You can for instance install the [Metamask](https://metamask.io/) extension (Firefox + Chrome). Also, you will need to have a little bit of Ether. On the Ethereum testnet Ropsten, you can have some for free. On Ethereum Mainnet, on which you should issue real certificates, it won't even cost $0.01 to issue a batch of up to thousands certificates.

## General discussion, installation and configuration help

Please post on the [OpenBlockcerts.org forum](TODO).

## Paid technical support, development and commercial services

Paid technical support and commercial services are available on [OpenBlockcerts.com](TODO).

## Development

Please read the [contribution guidelines](CONTRIBUTING.md).

## Credits

+ [GIZ](https://www.giz.de/en/html/index.html) (Deutsche Gesellschaft für Internationale Zusammenarbeit GmbH): this application has been originally developed with financial support by GIZ Lab.
+ [SEAMEO INNOTECH](https://www.seameo-innotech.org/) (Regional Center for Educational Innovation and Technology, Southeast Asian Ministers of Education Organization) : this application has been originally developed for SEAMEO-INNOTECH.
