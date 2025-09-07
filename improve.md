# Project Improvements and Known Issues

This document outlines known issues, security vulnerabilities, and potential architectural improvements for the Privacy Pass Interactive Demo. It is intended to guide future development and provide a clear record of the project's current limitations.

## 1. Security Vulnerabilities (Educational Demo Only)

The current implementation is for **educational purposes only** and contains several simplifications that make it insecure for production use. Do not deploy this code in a real-world scenario without addressing the following:

- **Insecure Hash-to-Curve Algorithm**: The `hashToCurve` and `hashToGroup` functions use a simplified method of generating a curve point from a hash. This method is not resistant to certain cryptographic attacks. A production system must use a standardized, robust algorithm like the one specified in [RFC 9380](https://www.rfc-editor.org/rfc/rfc9380.html).

- **Mocked DLEQ Proof Verification**: The client-side `verifyProof` function is currently a mock. It does not perform the actual mathematical verification of the DLEQ proof provided by the server. It simply returns `true` unless a "malicious" flag is set. This was done to simplify the demo flow but means the "Verifiable" aspect of VOPRF is not actually implemented on the client.

- **Insecure Random Number Generation**: The cryptographic functions may rely on `Math.random()` or other non-cryptographically secure random number generators in some places. All cryptographic secrets, including private keys and blinding factors, must be generated using a cryptographically secure pseudorandom number generator (CSPRNG), such as `window.crypto.getRandomValues()` in browsers or the `crypto` module in Node.js.

- **No Rate Limiting or DoS Protection**: The backend server has no rate limiting. An attacker could repeatedly call the `/api/v1/evaluate` or `/api/v1/redeem` endpoints to consume server resources or pollute the `usedNonces` set.

- **In-Memory Nonce Storage**: The server stores the set of used nonces in memory. This means that if the server restarts, all nonces are forgotten, and tokens could potentially be double-spent. A production system would require a persistent database for storing nonces.

- **Lack of Input Validation**: While there is basic format checking, the server does not perform comprehensive validation on the cryptographic inputs (e.g., checking if points are on the curve). Malformed inputs could crash the server or lead to unexpected behavior.

## 2. Code Quality & Architecture

- **Redundant Cryptography Code**: The files `src/lib/crypto.js` (client-side) and `server/crypto.js` (server-side) are identical. This is a significant maintenance issue, as any change to a cryptographic function must be manually duplicated in both files.
  - **Recommendation**: Refactor this into a single, shared library. This could be achieved by creating a separate package or by configuring the build system (e.g., Vite) to correctly resolve a shared module for both the frontend and backend.

- **Unimplemented Features**: The documentation (`ARCHITECTURE.md`) describes interactive components (`ECC_Visualizer.jsx`, `VOPRF_Simulator.jsx`) and a shared UI library (`src/components/ui/`). However, the `src/components/interactive` and `src/components/ui` directories are empty.
  - **Recommendation**: These features should be marked as "Future Work" in the documentation to avoid confusion. The documentation has been updated to reflect this.
