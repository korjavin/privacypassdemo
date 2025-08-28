import { secp256k1 } from '@noble/curves/secp256k1';
import { bytesToHex } from '@noble/curves/abstract/utils';
import { sha256 } from '@noble/hashes/sha256';

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
 * Hashes a string to a point on the secp256k1 curve.
 * This is a simplified implementation for demonstration purposes.
 *
 * @param {string} data The string to hash.
 * @returns {import('@noble/curves/abstract/weierstrass').ProjectivePoint} The resulting point on the curve.
 */
export function hashToGroup(data) {
  const messageBytes = new TextEncoder().encode(data);
  const hash = sha256(messageBytes);
  // Using the hash as a private key is a common way to get a point from data.
  return secp256k1.Point.fromPrivateKey(hash);
}

/**
 * Converts a point on the curve to its compressed, hex-encoded representation.
 *
 * @param {import('@noble/curves/abstract/weierstrass').ProjectivePoint} point The point to convert.
 * @returns {string} The compressed, hex-encoded point.
 */
export function pointToHex(point) {
  return point.toHex(true); // true for compressed
}

/**
 * Multiplies a point on the curve by a scalar.
 *
 * @param {import('@noble/curves/abstract/weierstrass').ProjectivePoint} point The point to multiply.
 * @param {Uint8Array} scalar The scalar to multiply by (as a byte array).
 * @returns {import('@noble/curves/abstract/weierstrass').ProjectivePoint} The resulting point.
 */
export function multiplyPoint(point, scalar) {
  const scalarBigInt = secp256k1.utils.bytesToNumberBE(scalar);
  return point.multiply(scalarBigInt);
}
