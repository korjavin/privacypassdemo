1. System Overview

This document specifies the technical architecture for Project AnonymityPass. The system is composed of three primary components: a Static Frontend, a Stateless Backend API, and a shared Crypto Simulation Engine. This architecture is designed for clarity, modularity, and to support the educational goals of the project.
The system components interact as follows:
The Static Frontend is the user-facing application. It delivers the educational narrative, renders all UI components, and manages the state for the interactive cryptographic demonstrations.
The Stateless Backend API simulates the "Server" role in the Privacy Pass protocol (e.g., Kagi). Its sole responsibilities are to hold a secret key, perform the VOPRF evaluation on blinded data sent by the client, and verify redeemed tokens. Its stateless nature is critical, as it reinforces the privacy-preserving goal of not maintaining user sessions.
The Crypto Simulation Engine is a JavaScript library of cryptographic primitives. It is used by the Frontend for client-side operations (blinding, unblinding, proof verification) and by the Backend for server-side operations (evaluation, proof generation). Using a shared library ensures mathematical consistency across the entire simulation.
!(placeholder_system_overview.png)
(A diagram generated from design/d_task_01_conceptual_diagrams.md will be placed here, showing the Frontend, Backend, and shared Crypto Engine.)

2. Frontend Architecture

Framework: The frontend will be built using React (v18 or later) with the Vite build tool. This choice provides a modern, fast development environment and a robust component-based model well-suited for the project's modular structure.
Component Structure: A clear, hierarchical file structure is to be enforced to facilitate parallel development. All components will reside within the src/components/ directory.
Educational step components: src/components/steps/Step1_Intro.jsx, src/components/steps/Step2_Goal.jsx, etc.
Interactive modules: src/components/interactive/ECC_Visualizer.jsx, src/components/interactive/VOPRF_Simulator.jsx, etc.
Shared UI elements: src/components/ui/Button.jsx, src/components/ui/Card.jsx, etc.
State Management: State will be managed at the component level using React Hooks (useState, useEffect) wherever possible. A global state management library (e.g., Redux, Zustand) is deemed unnecessary for the scope of this project and would introduce needless complexity. Interactive modules will manage their own internal state, receiving initial props from their parent step component.

3. Backend API Specification

Framework: The backend API will be a lightweight server built with Node.js and the Express.js framework. This provides a simple yet powerful foundation for creating the required API endpoints.
Stateless Design: The API must be completely stateless. No session data, cookies, or user-specific state should be stored on the server between requests. Each API call must be independent and contain all necessary information for its processing. This design directly reflects the behavior of a real-world Privacy Pass issuer. The only state the server will maintain is a global, in-memory set of redeemed token nonces to prevent double-spending, which will be reset on server restart.
The design of the API endpoints is intentionally granular to serve as a pedagogical tool. The sequence of API calls required by the frontend simulation directly mirrors the real-world flow of the VOPRF protocol. This reinforces the learning process by making the protocol steps tangible through network requests.

Endpoint
Method
Request Body (JSON)
Success Response (200)
Error Response (400/500)
Purpose
/api/v1/keys
GET
{}
{ "publicKey": "..." }
{ "error": "Server key unavailable" }
Fetches the server's public key (K). Simulates the initial setup where the server makes its key available for verification.
/api/v1/evaluate
POST
{ "blindedElement": "..." }
{ "evaluatedElement": "...", "proof": "..." }
{ "error": "Invalid blinded element" }
The core VOPRF evaluation. The server applies its secret key (k) to the client's blinded input and generates a DLEQ proof of correctness.
/api/v1/redeem
POST
{ "token": { "nonce": "...", "output": "..." } }
{ "status": "success", "message": "Token redeemed successfully." }
{ "error": "Token invalid or already used" }
Simulates redeeming a token to access a service. The server verifies the token signature and checks its nonce against a list of already-used nonces.2


4. Cryptographic Simulation Engine

This shared JavaScript library (src/lib/crypto.js) will contain all the core cryptographic logic. It must be usable in both the Node.js backend and the browser frontend. While it does not need to be production-grade in terms of side-channel resistance (e.g., constant-time operations), it must be mathematically correct to accurately demonstrate the protocol.
Language: JavaScript (ESM).
Dependencies: A well-vetted library for elliptic curve operations, such as noble-curves, should be used to handle the low-level mathematics.
Core Primitives to Implement:
Elliptic Curve Operations: The engine will be configured to use a standard, widely-supported curve such as P-256. It must provide wrapper functions for:
Scalar multiplication: multiply(point, scalar)
Point addition: add(point1, point2)
Hashing to the curve: hashToGroup(data)
Generating a random scalar: randomScalar()
VOPRF Logic: The engine must implement the client-side and server-side functions of the VOPRF protocol, as generally described in the IETF drafts.6
blind(input): Takes a client input (nonce), hashes it to the curve, and multiplies by a random blinding factor (r). Returns the blinded element and the blinding factor.
unblind(evaluatedElement, blindingFactor): Takes the server's evaluated element and the client's stored blinding factor. Multiplies by the inverse of the blinding factor (r−1) to produce the final token output.
finalize(input, output): A helper function to derive a shared value if needed, though for this educational purpose, the primary output is the token itself.
evaluate(blindedElement, secretKey): A server-side function that performs scalar multiplication of the blinded element by the server's secret key (k).
DLEQ Proof System: The engine must implement the generation and verification of a Discrete Logarithm Equivalence (DLEQ) proof. This is the Zero-Knowledge Proof that underpins the "Verifiable" property of the VOPRF.7
generateProof(secretKey, G, H, kG, kH): A server-side function that takes the secret key (k), the base points (G and H, where H is the blinded element), and the resulting public points (kG and kH) to generate a non-interactive proof of equivalence.
verifyProof(G, H, kG, kH, proof): A client-side function that takes the public points and the proof, and returns true or false without needing to know the secret key (k).
