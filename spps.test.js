'use strict';

const spps  = require('./spps');

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
