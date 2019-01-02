#thinglator-driver-ring

Allows the Thinglator platform to control Ring doorbells.

## Requirements

* node.js
* Thinglator - https://github.com/richardwillars/thinglator
* Active Internet connection - Ethernet or WiFi (it uses HTTP to talk to the Ring servers)

## Installation for usage

Navigate to the root of your Thinglator installation and run:

> yarn add thinglator-driver-ring

> yarn dev

# Installation for development

Navigate to the root of the thinglator-driver-ring project and run:

> yarn install

> yarn link

Navigate to the root of your Thinglator installation and run:

> yarn add thinglator-driver-ring

Go to the thinglator project and run:

> yarn link thinglator-driver-ring

This will point thinglator/node_modules/thinglator-driver-ring to the directory where you just installed thinglator-driver-ring. This makes it easier for development and testing of the module.

> yarn dev

## Test

> yarn test
> or
> yarn test:watch
