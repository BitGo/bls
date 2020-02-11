import {Keypair} from "./keypair";
import {PrivateKey} from "./privateKey";
import {PublicKey} from "./publicKey";
import {Signature} from "./signature";
import {BLSPubkey, BLSSecretKey, BLSSignature, Bytes32, Domain} from "@chainsafe/eth2.0-types";
import {PUBLIC_KEY_LENGTH} from "./constants";
import assert from "assert";

export {Keypair, PrivateKey, PublicKey, Signature};

export {init as initBLS} from "./context";

/**
 * Generates new secret and public key
 */
export function generateKeyPair(): Keypair {
  return Keypair.generate();
}

/**
 * Generates public key from given secret.
 * @param {BLSSecretKey} secretKey
 */
export function generatePublicKey(secretKey: BLSSecretKey): Buffer {
  assert(secretKey, "secretKey is null or undefined");
  const keypair = new Keypair(PrivateKey.fromBytes(Buffer.from(secretKey as Uint8Array)));
  return keypair.publicKey.toBytesCompressed();
}

/**
 * Signs given message using secret key.
 * @param secretKey
 * @param messageHash
 * @param domain
 */
export function sign(secretKey: BLSSecretKey, messageHash: Bytes32, domain: Domain): Buffer {
  assert(secretKey, "secretKey is null or undefined");
  assert(messageHash, "messageHash is null or undefined");
  assert(domain, "domain is null or undefined");
  const privateKey = PrivateKey.fromBytes(Buffer.from(secretKey as Uint8Array));
  return privateKey.signMessage(
    Buffer.from(messageHash as Uint8Array),
    Buffer.from(domain as Uint8Array)
  ).toBytesCompressed();
}

/**
 * Compines all given signature into one.
 * @param signatures
 */
export function aggregateSignatures(signatures: BLSSignature[]): Buffer {
  assert(signatures, "signatures is null or undefined");
  return signatures.map((signature): Signature => {
    return Signature.fromCompressedBytes(Buffer.from(signature as Uint8Array));
  }).reduce((previousValue, currentValue): Signature => {
    return previousValue.add(currentValue);
  }).toBytesCompressed();
}

/**
 * Combines all given public keys into single one
 * @param publicKeys
 */
export function aggregatePubkeys(publicKeys: BLSPubkey[]): Buffer {
  assert(publicKeys, "publicKeys is null or undefined");
  if(publicKeys.length === 0) {
    return Buffer.alloc(PUBLIC_KEY_LENGTH);
  }
  return publicKeys.map((p) => PublicKey.fromBytes(Buffer.from(p as Uint8Array))).reduce((agg, pubKey) => {
    if(agg) {
      return agg.add(pubKey);
    } else {
      return pubKey;
    }
  }
  ).toBytesCompressed();
}

/**
 * Verifies if signature is message signed with given public key.
 * @param publicKey
 * @param messageHash
 * @param signature
 * @param domain
 */
export function verify(publicKey: BLSPubkey, messageHash: Bytes32, signature: BLSSignature, domain: Domain): boolean {
  assert(publicKey, "publicKey is null or undefined");
  assert(messageHash, "messageHash is null or undefined");
  assert(signature, "signature is null or undefined");
  assert(domain, "domain is null or undefined");
  try {
    return PublicKey
      .fromBytes(Buffer.from(publicKey as Uint8Array))
      .verifyMessage(
        Signature.fromCompressedBytes(Buffer.from(signature as Uint8Array)),
        Buffer.from(messageHash as Uint8Array),
        Buffer.from(domain as Uint8Array)
      );
  } catch (e) {
    return false;
  }
}

/**
 * Verifies if signature is list of message signed with corresponding public key.
 * @param publicKeys
 * @param messageHashes
 * @param signature
 * @param domain
 */
export function verifyMultiple(
  publicKeys: BLSPubkey[],
  messageHashes: Bytes32[],
  signature: BLSSignature,
  domain: Domain
): boolean {
  assert(publicKeys, "publicKey is null or undefined");
  assert(messageHashes, "messageHash is null or undefined");
  assert(signature, "signature is null or undefined");
  assert(domain, "domain is null or undefined");

  if(publicKeys.length === 0 || publicKeys.length != messageHashes.length) {
    return false;
  }
  try {
    return Signature
      .fromCompressedBytes(Buffer.from(signature as Uint8Array))
      .verifyMultiple(
        publicKeys.map((key) => PublicKey.fromBytes(Buffer.from(key as Uint8Array))),
        messageHashes.map((m) => Buffer.from(m as Uint8Array)),
        Buffer.from(domain as Uint8Array),
      );
  } catch (e) {
    return false;
  }
}

export default {
  generateKeyPair,
  generatePublicKey,
  sign,
  aggregateSignatures,
  aggregatePubkeys,
  verify,
  verifyMultiple
};
