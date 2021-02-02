'use strict';

const AES = require("crypto-js/aes");
const fs = require('fs')

console.log(process.env.USERPROFILE)
readMasterKey();

function getMasterKeyFile() {
    // TODO env "USERPROFILE" on each system same?
    return process.env.USERPROFILE + "/.elomagic/masterkey";
}

function readMasterKey() {

    const filename = getMasterKeyFile();

    var key

    if (!fs.existsSync(filename)) {
        const base64data = fs.readFileSync(filename, 'utf8')
        key = Buffer.from(base64data, 'base64');
    } else {
        // TODO Not implemented yet


    }

    return key

}

let text = AES.decrypt("ThisIsASecret", readMasterKey());
console.log(text)

