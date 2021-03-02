'use strict';

const fs = require('fs');
const fse = require('fs-extra');
const os = require('os');
const PRIVATE_FILE = os.homedir() + "/.spps/settings";
let backup;

const spps  = require('./spps');

beforeAll(() => {
    if (fs.existsSync(PRIVATE_FILE)) {
        backup = fs.readFileSync(PRIVATE_FILE, 'UTF-8');

        fse.removeSync(PRIVATE_FILE)
    }
})

afterAll(() => {
    fse.removeSync(PRIVATE_FILE)

    if (backup != null) {
        fs.writeFileSync(PRIVATE_FILE, backup, { encoding: "utf-8"} );
    }
})

test('createPrivateKey', () => {
    expect(fs.existsSync(PRIVATE_FILE)).toBe(false);

    spps.createPrivateKey(true)

    expect(fs.existsSync(PRIVATE_FILE)).toBe(true);

    let lines = fs.readFileSync(PRIVATE_FILE, 'UTF-8');
    expect(lines.includes("key=")).toBe(true);
    expect(lines.includes("relocation=")).toBe(true);
})

test('isEncryptedValue', () => {
    expect(spps.isEncryptedValue("{abc}")).toBe(true);
    expect(spps.isEncryptedValue("abc}")).toBe(false);
    expect(spps.isEncryptedValue("{abc")).toBe(false);
    expect(spps.isEncryptedValue("abc")).toBe(false);
    expect(spps.isEncryptedValue(null)).toBe(false);
})

test('en-/decrypt strings', () => {
    const v1 = spps.encrypt("secret");
    const v2 = spps.encrypt("secret");
    expect(v1).not.toEqual(v2);

    const value = "secretäöüß"

    const encrypted = spps.encrypt(value)
    console.log(value + " = " + encrypted);
    expect(encrypted).not.toEqual(value);
    const decrypted = spps.decryptString(encrypted)
    expect(decrypted).toEqual(decrypted);

    expect(spps.encrypt(null)).toEqual(null);
    expect(spps.decryptString(null)).toEqual(null);
})
