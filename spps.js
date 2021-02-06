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

const ALGORITHM = 'aes-256-gcm'
const MASTER_FILE_PATH = process.env.USERPROFILE + "/.spps/";
const MASTER_FILE = MASTER_FILE_PATH + "masterkey";

/**
 * Returns true when value is encrypted, tagged by surrounding braces "{" and "}".
 *
 * @param value Value to be checked
 * @returns {boolean} Returns true when value is identified as an encrypted value.
 */
function isEncryptedValue(value) {
    return value != null && value.startsWith('{') && value.endsWith("}");
}

function readMasterKey() {
    let key

    if (fs.existsSync(MASTER_FILE)) {
        const base64data = fs.readFileSync(MASTER_FILE, 'utf8')
        key = Buffer.from(base64data, 'base64');
    } else {
        if (!fs.existsSync(MASTER_FILE_PATH)){
            fs.mkdirSync(MASTER_FILE_PATH);
        }

        key = crypto.randomBytes(32);
        let base64 = key.toString('base64');

        fs.writeFileSync(MASTER_FILE, base64, { encoding: "ascii"} );
    }

    return key
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

    const key = readMasterKey();
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

    const key = readMasterKey();

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
    encrypt,
    decryptString
};