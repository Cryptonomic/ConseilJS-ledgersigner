import { Signer, SignerCurve, TezosMessageUtils } from 'conseiljs';

import { TezosLedgerConnector, Curve } from './TezosLedgerConnector'

const curveMap = {
    [SignerCurve.ED25519]: Curve.ED25519,
    [SignerCurve.SECP256K1]: Curve.SECP256K1,
    [SignerCurve.SECP256R1]: Curve.SECP256R1
}

/**
 *  
 */
export class LedgerSigner implements Signer {
    readonly derivationPath: string;
    readonly connector: TezosLedgerConnector;
    readonly curve: SignerCurve;

    constructor(connector: TezosLedgerConnector, derivationPath: string, curve: SignerCurve = SignerCurve.ED25519) {
        this.connector = connector;
        this.derivationPath = derivationPath;
        this.curve = curve;
    }

    public getSignerCurve(): SignerCurve {
        return this.curve;
    }

    /**
     * Given a BIP44 derivation path for Tezos, and the hex encoded, watermarked Tezos Operation, sign using the ledger
     * 
     * @param derivationPath BIP44 Derivation Path
     * @param watermarkedOpInHex Operation
     */
    public async signOperation(bytes: Buffer): Promise<Buffer> {
        const result = await this.connector.signOperation(this.derivationPath, bytes, curveMap[this.curve]);
        const signatureBytes = Buffer.from(result, 'hex');

        return signatureBytes;
    }

    /**
     * Signs arbitrary text using a Ledger device.
     * 
     * @param message Plain text of the message in UTF-8 encoding.
     * @returns {Promise<string>} base58check-encoded signature prefixed with 'edsig'.
     */
    public async signText(message: string): Promise<string> {
        const result = await this.connector.signHex(this.derivationPath, Buffer.from(message, 'utf8'), curveMap[this.curve]);
        const messageSig = Buffer.from(result, 'hex');

        return TezosMessageUtils.readSignatureWithHint(messageSig, 'edsig');
    }

    /**
     * Convenience function that uses Tezos nomenclature to sign arbitrary text on a Ledger device. This method produces a 32-byte blake2s hash prior to signing.
     * 
     * @param message Plain text of the message in UTF-8 encoding. 
     * @returns {Promise<string>} base58check-encoded signature prefixed with `edsig`.
     */
    public async signTextHash(message: string): Promise<string> {
        const messageHash = TezosMessageUtils.simpleHash(Buffer.from(message, 'utf8'), 32);
        const result = await this.connector.signHex(this.derivationPath, messageHash, curveMap[this.curve]);
        const messageSig = Buffer.from(result, 'hex');

        return TezosMessageUtils.readSignatureWithHint(messageSig, 'edsig');

    }
}
