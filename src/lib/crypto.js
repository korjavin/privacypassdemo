import { secp256k1 } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/curves/abstract/utils';
import { sha256 } from '@noble/hashes/sha2.js';
import { mod } from '@noble/curves/abstract/modular';

/**
 * The generator point G for the secp256k1 curve.
 */
export const G = secp256k1.ProjectivePoint.BASE;

/**
 * Hashes a string message to a point on the secp256k1 curve.
 * This is a simplified implementation for demonstration purposes.
 * A real implementation should use a more robust hash-to-curve algorithm.
 *
 * @param {string} message The message to hash.
 * @returns {import('@noble/curves/abstract/weierstrass').ProjectivePoint} The resulting point on the curve.
 */
export function hashToCurve(message) {
  const msgBytes = new TextEncoder().encode(message);
  const hashBytes = sha256(msgBytes);
  // This is not a secure way to generate a point from a hash.
  // A proper implementation would use a standardized algorithm like hash-to-curve.
  // For this simulation, we'll use the hash as the x-coordinate and find a valid y.
  try {
    return secp256k1.ProjectivePoint.fromHex(bytesToHex(hashBytes));
  } catch (e) {
    // If the hash doesn't correspond to a valid point, we can try again with a modified hash.
    // For simplicity, we'll just hash the hash and try again. This is not robust.
    const newHashBytes = sha256(hashBytes);
    return secp256k1.ProjectivePoint.fromHex(bytesToHex(newHashBytes));
  }
}


/**
 * Blinds a token for the VOPRF protocol.
 *
 * @param {string} token The token to be blinded.
 * @returns {{blindedToken: string, blindingFactor: bigint}} The blinded token and the blinding factor.
 */
export function blind(token) {
  const T = hashToCurve(token);
  const r = secp256k1.utils.randomPrivateKey();
  const M = T.multiply(mod(BigInt('0x' + bytesToHex(r)), secp256k1.CURVE.n));
  return {
    blindedToken: M.toHex(),
    blindingFactor: BigInt('0x' + bytesToHex(r)),
  };
}

/**
 * Unblinds an evaluated token from the server.
 *
 * @param {string} evaluatedTokenHex The hex-encoded evaluated token from the server.
 * @param {bigint} blindingFactor The original blinding factor used to blind the token.
 * @returns {string} The final unblinded token.
 */
export function unblind(evaluatedTokenHex, blindingFactor) {
  const Z = secp256k1.ProjectivePoint.fromHex(evaluatedTokenHex);
  const rInv = mod(blindingFactor, secp256k1.CURVE.n);
  const N = Z.multiply(rInv);
  return N.toHex();
}

/**
 * Verifies the DLEQ proof from the server.
 * Note: This is a mock implementation for the simulation.
 *
 * @param {object} proof The proof object from the server.
 * @param {boolean} isMalicious A flag to simulate a malicious server.
 * @returns {boolean} True if the proof is valid, false otherwise.
 */
export function verifyProof(proof, isMalicious = false) {
  if (isMalicious) {
    return false;
  }
  // In a real implementation, we would perform the DLEQ verification here.
  // For the simulation, we'll just assume the proof is valid unless in malicious mode.
  return true;
}


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
