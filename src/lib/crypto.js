import { secp256k1 } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/curves/abstract/utils';
import { sha256 } from '@noble/hashes/sha2.js';
import { mod } from '@noble/curves/abstract/modular';

/**
 * The generator point G for the secp256k1 curve.
 */
export const G = secp256k1.ProjectivePoint.BASE;

/**
 * Multiplies the generator point G by a scalar k.
 *
 * @param {number} k The scalar to multiply by.
 * @returns {import('@noble/curves/abstract/weierstrass').ProjectivePoint} The resulting point K = k * G.
 */
export function multiply(k) {
  // The most direct way is to use the point multiplication method.
  return secp256k1.ProjectivePoint.BASE.multiply(BigInt(k));
}

/**
 * Generates a new random private key.
 *
 * @returns {Uint8Array} A 32-byte private key.
 */
export function generatePrivateKey() {
  return secp256k1.utils.randomPrivateKey();
}

/**
 * Computes the public key from a private key.
 *
 * @param {Uint8Array} privateKey The private key.
 * @returns {string} The compressed public key, hex-encoded.
 */
export function getPublicKey(privateKey) {
  const publicKeyBytes = secp256k1.getPublicKey(privateKey, true); // true for compressed
  return bytesToHex(publicKeyBytes);
}

/**
 * Evaluates a blinded element with the private key.
 *
 * @param {Uint8Array} privateKey The server's private key.
 * @param {string} blindedElementHex The hex-encoded blinded element from the client.
 * @returns {{blindedPoint: import('@noble/curves/abstract/weierstrass').ProjectivePoint, evaluatedPoint: import('@noble/curves/abstract/weierstrass').ProjectivePoint, evaluatedElement: string}}
 */
export function evaluate(privateKey, blindedElementHex) {
  const blindedPoint = secp256k1.ProjectivePoint.fromHex(blindedElementHex);
  const k = BigInt('0x' + bytesToHex(privateKey));
  const evaluatedPoint = blindedPoint.multiply(k);
  const evaluatedElement = bytesToHex(evaluatedPoint.toRawBytes(true)); // compressed
  return { blindedPoint, evaluatedPoint, evaluatedElement };
}

/**
 * Generates a DLEQ proof.
 * H = sha256
 * G, K = k*G
 * B (blinded), Y = k*B
 *
 * Prover chooses random r, computes:
 * A = r*G
 * C = r*B
 * c = H(G, K, B, Y, A, C)
 * s = r + c*k mod n
 *
 * Proof is (c, s)
 *
 * @param {Uint8Array} privateKey The server's private key k.
 * @param {import('@noble/curves/abstract/weierstrass').ProjectivePoint} blindedPoint The blinded element B.
 * @param {import('@noble/curves/abstract/weierstrass').ProjectivePoint} evaluatedPoint The evaluated element Y.
 * @returns {string} The DLEQ proof, JSON-stringified.
 */
export function generateProof(privateKey, blindedPoint, evaluatedPoint) {
  const k = BigInt('0x' + bytesToHex(privateKey));
  const K = G.multiply(k); // Public key point
  const B = blindedPoint;
  const Y = evaluatedPoint;

  // Prover chooses random r
  const rBytes = generatePrivateKey(); // Re-use for randomness
  const r = BigInt('0x' + bytesToHex(rBytes));

  // A = r*G
  const A = G.multiply(r);
  // C = r*B
  const C = B.multiply(r);

  // c = H(G, K, B, Y, A, C)
  const gHex = bytesToHex(G.toRawBytes(true));
  const kHex = bytesToHex(K.toRawBytes(true));
  const bHex = bytesToHex(B.toRawBytes(true));
  const yHex = bytesToHex(Y.toRawBytes(true));
  const aHex = bytesToHex(A.toRawBytes(true));
  const cHexForHash = bytesToHex(C.toRawBytes(true));

  const hashInput = gHex + kHex + bHex + yHex + aHex + cHexForHash;
  const cHash = sha256(hexToBytes(hashInput));
  const c = BigInt('0x' + bytesToHex(cHash));

  // s = r + c*k mod n
  const s = mod(r + c * k, secp256k1.CURVE.n);

  const proof = {
    c: bytesToHex(cHash),
    s: s.toString(16),
  };

  return JSON.stringify(proof);
}
