import { secp256k1 } from '@noble/curves/secp256k1';

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
