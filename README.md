# spps-npm

Simple Password Protection Solution for Node.js

---

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Build Status](https://travis-ci.com/elomagic/spps-npm.svg?branch=main)](https://travis-ci.com/elomagic/spps-npm)
[![Coverage Status](https://coveralls.io/repos/github/elomagic/spps-npm/badge.svg?branch=main)](https://coveralls.io/github/elomagic/spps-npm?branch=main)
[![GitHub issues](https://img.shields.io/github/issues-raw/elomagic/spps-npm)](https://github.com/elomagic/spps-npm/issues)

The SPPS is a lightweight solution to protect / hide your password or anything else from your code.

## Features

* AES 256 GCM en-/decryption
* Cross programming languages support ([Java](https://github.com/elomagic/spps-jbc), [Python](https://github.com/elomagic/spps-py), [Node.js](https://github.com/elomagic/spps-npm))

## Concept

This solution helps one to accidentally publish secrets unintentionally by splitting the secret into an encrypted part and a private key.
The private key is kept separately from the rest, in a secure location for the authorized user only.

The private key is randomized for each user on each system and is therefore unique. This means that if someone has the encrypted secret,
they can only read it if they also have the private key. You can check this by trying to decrypt the encrypted secret with another user or another system. You will not succeed.

A symmetrical encryption based on the AES-GCM 256 method is used. See also https://en.wikipedia.org/wiki/Galois/Counter_Mode

The private key is stored in a file ```"/.spps/settings"``` of the user home folder.

Keep in mind that anyone who has access to the user home or relocation folder also has access to the private key !!!!

## Example

``` javascript
const spps = require('spps');

let encryptedSecret = spps.encrypt("My Secret");
console.log("My encrypted secret is " + encryptedSecret);

let secret = spps.decryptString(encryptedSecret)
console.log("...and my secret is " + secret);
```

## How to create a private key

### Create a private in your home folder:

Enter following command in your terminal:

```bash
node ...
```

The settings file ```'~/.spps/settings'``` in your home folder will look like:

```properties
key=5C/Yi6+hbgRwIBhXT9PQGi83EVw2Oe6uttRSl4/kLzc=
relocation=
```

### Alternative, create a private key on a removable device:

Enter following command in your terminal:

```bash
node ...
```

The settings file ```'~/.spps/settings'``` in your home folder will look like:

```properties
key=
relocation=/Volumes/usb-stick
```

...and in the relocation folder look like:

```properties
key=5C/Yi6+hbgRwIBhXT9PQGi83EVw2Oe6uttRSl4/kLzc=
relocation=
```

## How to create an encrypted password

Enter following command in your terminal:

```bash
node ... 
```

Output should look like:
```
{MLaFzwpNyKJbJSCg4xY5g70WDAKnOhVe3oaaDAGWtH4KXR4=}
```

##