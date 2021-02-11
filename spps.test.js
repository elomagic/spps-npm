'use strict';

const fs = require('fs');
const fse = require('fs-extra');
const os = require('os');
const MASTER_FILE = os.homedir() + "/.spps/masterkey";
let backup;

const spps  = require('./spps');

beforeAll(() => {
    if (fs.existsSync(MASTER_FILE)) {
        backup = fs.readFileSync(MASTER_FILE, 'UTF-8');

        fse.removeSync(MASTER_FILE)
    }
})

afterAll(() => {
    fse.removeSync(MASTER_FILE)

    if (backup != null) {
        fs.writeFileSync(MASTER_FILE, backup, { encoding: "utf-8"} );
    }
})

test('createMasterKey', () => {
    expect(fs.existsSync(MASTER_FILE)).toBe(false);

    spps.createMasterKey(true)

    expect(fs.existsSync(MASTER_FILE)).toBe(true);

    let lines = fs.readFileSync(MASTER_FILE, 'UTF-8');
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
