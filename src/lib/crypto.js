// Task g4_task_12: Implement backend /api/v1/keys endpoint
import { secp256k1 } from '@noble/curves/secp256k1';
import { bytesToHex } from '@noble/curves/abstract/utils';

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
