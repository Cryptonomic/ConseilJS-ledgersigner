import {expect} from 'chai';
import { TezosMessageUtils } from 'conseiljs';
import dotenv from 'dotenv';

import { TezosLedgerConnector } from '../src/TezosLedgerConnector';

dotenv.config();

describe('TezosLedgerConnector tests', async () => {
    let connector: TezosLedgerConnector;

    beforeEach(async () => {
        connector = await TezosLedgerConnector.getInstance();
    });

    it('getPublicKey()', async () => {
        const publicKeyHex = await connector.getPublicKey(process.env.test_derivation_path as string, true);

        const publicKeyBytes = Buffer.from(publicKeyHex, 'hex').subarray(1); // We slice off a byte to make sure we have a 64 bits coming in from the ledger package
        const publicKey = TezosMessageUtils.readKeyWithHint(publicKeyBytes, "edpk");
        const publicKeyHash = TezosMessageUtils.computeKeyHash(publicKeyBytes, 'tz1');

        expect(publicKey).to.equal(process.env.test_public_key);
        expect(publicKeyHash).to.equal(process.env.test_public_key_hash);
    });

    it('signText()', async () => {
        const signatureHex = await connector.signHex(process.env.test_derivation_path as string, Buffer.from('wagmi', 'utf8'));
        const signature = TezosMessageUtils.readSignatureWithHint(Buffer.from(signatureHex, 'hex'), 'edsig');

        expect(signature).to.equal(process.env.test_wagmi_sig);
    });
});