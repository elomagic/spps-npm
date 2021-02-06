# spps-npm

Simple Password Protection Solution for NPM

---

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Build Status](https://img.shields.io/github/workflow/status/elomagic/spps-npm/CI)](https://github.com/elomagic/spps-npm/actions?query=workflow%3A%22CI)
[![Coverage Status](https://coveralls.io/repos/github/elomagic/spps-npm/badge.svg)](https://coveralls.io/github/elomagic/spps-npm)
[![GitHub issues](https://img.shields.io/github/issues-raw/elomagic/spps-npm)](https://github.com/elomagic/spps-npm/issues)

The SPPS is a lightweight solution to protect / hide your password or anything else from your code.

## Features

* AES 256 CGM en-/decryption
* Cross programming languages support (Java, Python, NodeJS)

## Concept

This solution helps one to accidentally publish secrets unintentionally by splitting the secret into an encrypted part and a private key.
The private key is kept separately from the rest, in a secure location for the authorized user only.

The private key is randomized for each user on each system and is therefore unique. This means that if someone has the encrypted secret,
they can only read it if they also have the private key. You can check this by trying to decrypt the encrypted secret with another user or another system. You will not succeed.

A symmetrical encryption based on the AES-GCM 256 method is used. See also https://en.wikipedia.org/wiki/Galois/Counter_Mode

The private key is stored in a file "/.sbbs/masterkey" of the user home folder.

Note that anyone who has access to the user home folder also has access to the master key !!!!

## Example

``` javascript
const spps = require('spps');

let encryptedSecret = spps.encrypt("My Secret");
console.log("My encrypted secret is " + encryptedSecret);

let secret = spps.decryptString(encryptedSecret)
console.log("...and my secret is " + secret);
```
