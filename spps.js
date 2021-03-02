/*
 * Simple Password Protection Solution for Node JS
 *
 * Copyright © 2021-present Carsten Rambow (spps.dev@elomagic.de)
 *
 * This file is part of Simple Password Protection Solution with Bouncy Castle.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const fs = require('fs');
const crypto = require('crypto');
const os = require('os');

const ALGORITHM = 'aes-256-gcm'
const PRIVATE_FILE_PATH = os.homedir() + "/.spps/";
const PRIVATE_FILE = PRIVATE_FILE_PATH + "settings";

function readProperty(file, key) {
    // read contents of the file
    const data = fs.readFileSync(file, 'UTF-8');

    // split the contents by new line
    const lines = data.split(/\r?\n/);

    let result = null;

    // print all lines
    lines.forEach((line) => {
        if (line.startsWith(key + "=")) {
            result = line.substring(key.length + 1).trim();
        }
    });

    return result;
}

function readPrivateKey(file = PRIVATE_FILE) {
    if (!fs.existsSync(file)) {
        throw new Error("Unable to find settings file. At first you have to create a private key.");
    }

    let relocation = readProperty(file, "relocation")

    if (relocation.length === 0) {
        return Buffer.from(readProperty(file, "key"), 'base64');
    } else {
        return readPrivateKey(Paths.get(p.getProperty(RELOCATION_KEY)));
    }
}

/**
 * Creates a new private key.
 *
 * @param force Must true to confirm to overwrite existing private key.
 * @throws GeneralSecurityException Thrown when unable to create private key
 */
function createPrivateKey(force) {
    _createPrivateKey(PRIVATE_FILE, force,null);
}

function _createPrivateKey(file, force, relocationFile) {
    if (fs.existsSync(file) && !force) {
        throw new Error("Private key file \"" + file+ "\" already exists. Use parameter \"-Force\" to overwrite it.");
    }

    // TODO Fix it
    if (!fs.existsSync(PRIVATE_FILE_PATH)){
        fs.mkdirSync(PRIVATE_FILE_PATH);
    }

    let lines;

    if (relocationFile == null || file.equals(relocationFile)) {
        lines = "key=" + crypto.randomBytes(32).toString('base64') + "\nrelocation=\n";
    } else {
        lines = "key=\nrelocation=" + relocationFile + "\n";
        _createPrivateKey(relocationFile, force, null);
    }

    fs.writeFileSync(file, lines, { encoding: "utf-8"} );
}

/**
 * Returns true when value is encrypted, tagged by surrounding braces "{" and "}".
 *
 * @param value Value to be checked
 * @returns {boolean} Returns true when value is identified as an encrypted value.
 */
function isEncryptedValue(value) {
    return value != null && value.startsWith('{') && value.endsWith("}");
}

/**
 * Encrypt, encode as Base64 and encapsulate with curly bracket of a string.
 *
 * @param value Value to encrypt
 * @returns {string|null} Returns a encrypted, Base64 encoded string, surrounded with curly brackets or null when given value was null
 */
function encrypt(value) {
    if (value == null) {
        return null;
    }

    const key = readPrivateKey();
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let buf = Buffer.concat([iv, cipher.update(value, 'utf8')]);
    buf = Buffer.concat([buf, cipher.final()]);
    buf = Buffer.concat([buf, cipher.getAuthTag()]);

    return "{" + buf.toString("base64") + "}";
}

/**
 * Decrypt an encrypted, Base64 encoded data string.
 *
 * @param encapsulatedEncryptedData Base64 encoded data string, encapsulated with curly brackets.
 * @returns {string|null} The encrypted data as string or nul when given value was also null
 */
function decryptString(encapsulatedEncryptedData) {
    if (encapsulatedEncryptedData == null) {
        return null;
    }

    if (!isEncryptedValue(encapsulatedEncryptedData)) {
        throw new Error("This value is not with curly brackets encapsulated as an encrypted value. Unable to decrypt.");
    }

    const base64encryptedData = encapsulatedEncryptedData.substring(1, encapsulatedEncryptedData.length-1);
    const encryptedData = Buffer.from(base64encryptedData, 'base64');

    const key = readPrivateKey();

    const iv = encryptedData.subarray(0, 16); // Get Initialization vector.
    const data = encryptedData.subarray(16, encryptedData.length-16);
    const tag = encryptedData.subarray(encryptedData.length-16, encryptedData.length);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    let dec = decipher.update(data, 'binary', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

module.exports = {
    isEncryptedValue,
    createPrivateKey,
    encrypt,
    decryptString
};