import {expect} from 'chai';
import { KeyStore } from 'conseiljs';
import dotenv from 'dotenv';

import { KeyStoreUtils } from '../src/LedgerKeyStore';

dotenv.config();

describe('LedgerKeyStore tests', async () => {
    it('unlockAddress()', async () => {
        const keyStore: KeyStore = await KeyStoreUtils.unlockAddress(process.env.test_derivation_path as string);

        expect(keyStore.publicKey).to.equal(process.env.test_public_key);
        expect(keyStore.publicKeyHash).to.equal(process.env.test_public_key_hash);
    });

    it('unlockAddress()', async () => {
        const keyStore: KeyStore = await KeyStoreUtils.unlockAddress("44'/1729'/0'/0'/1'");

        expect(keyStore.publicKey).not.to.equal(process.env.test_public_key);
        expect(keyStore.publicKeyHash).not.to.equal(process.env.test_public_key_hash);
    });
});
