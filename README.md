# Auther API

Auther API to host and share online Blockcerts certificates.

## Introduction

**Auther-API** is an opensource API to host and share online Blockcerts certificates.

This project is purely a backend server. It's intended to be best used with the [Auther client](https://github.com/AutherOrg/auther-client) project.

## Requirements

+ Node.js (version >= 10, version 13 prefered).
+ A database (MySql >= 5.7.8 or MariaDb >= 10.2.7)

## Installation

### Development mode

````
yarn install
cp .env.example .env
cp src/seeders/1_users.seed.js.example src/seeders/1_users.seed.js
````

*If you don't have yarn, you can use npm instead.*

Edit .env to set your credentials and src/seeders/1_users.seed.js to set the administrator account. For PASSPORT_SECRET you can use this generator ofr instance: https://codepen.io/corenominal/pen/rxOmMJ

Init the database:

````
yarn initdb
````

Start the server (development mode):

````
yarn start
````

### Production mode

#### PM2

You can manage the application service as you want. Here is a short example with [PM2](https://pm2.keymetrics.io/):

+ Install PM2 globally: `yarn global add pm2`
+ Start a PM2 app: `pm2 start src/server.js`
+ Tail the PM2 logs: `pm2 logs`
+ Monitor the PM2 logs : `pm2 monitor`
+ Flush the PM2 logs: `pm2 flush`

By default, the logs are in `$HOME/.pm2/logs/`.

##### Rotate & compress logs with PM2

To rotate & compress logs with PM2 you can use [PM2 log-rotate](https://github.com/keymetrics/pm2-logrotate): `pm2 install pm2-logrotate`

For instance to use the default settings and compress the rotated files: `pm2 set pm2-logrotate:compress true`

#### Nginx proxy

You can either directly expose the API to the outside on the port SERVER_PORT defined in .env.

Or you can use a Nginx proxy and forward IPs, for instance (without HTTPS but it's of course advised in prod):

````
server {
  listen *:80;
  server_name api.auther.com;
  location / {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    #proxy_set_header X-Forwarded-Proto https;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Host $remote_addr;
    proxy_pass http://127.0.0.1:4000/;
    client_max_body_size 5m;
  }
}
````

... where `4000` in `proxy_pass http://127.0.0.1:4000/` is SERVER_PORT defined in .env.

## Logs

There are 4 kinds of logs:

### Server start

This is just a message when starting the server, specifying on which port it's running.

### HTTP requests

All HTTP requests are logged by [Morgan](https://github.com/expressjs/morgan) with this custom format:

`':remote-addr :user-id :method :url HTTP/:http-version :status :response-time'`

where `:user-id` is a custom token resolving to `-` for unauthenticated requests and to the user ID in the database for authenticated users (example: `123`).

### Database queries

All database queries are logged by default by [Sequelize](https://sequelize.org/), the ORM used in this project.

### Sent emails

All the emails sent by the server are logged with the format:

`to, text, result` where:

+ to is the recipient email address
+ text is the message in text format
+ result is either success or an error message

## General discussion, installation and configuration help

+ [Auther.org forum](https://auther.org/forum)

## Paid technical support, development and commercial services

+ You can [contact Auther's original author](https://guillaumeduveau.com/en/contact)

## Development

Please read the [contribution guidelines](CONTRIBUTING.md).

## Credits

+ [GIZ](https://www.giz.de/en/html/index.html) (Deutsche Gesellschaft für Internationale Zusammenarbeit GmbH): this application has been originally developed with financial support by GIZ Lab.
+ [SEAMEO INNOTECH](https://www.seameo-innotech.org/) (Regional Center for Educational Innovation and Technology, Southeast Asian Ministers of Education Organization) : this application has been originally developed for SEAMEO-INNOTECH.
