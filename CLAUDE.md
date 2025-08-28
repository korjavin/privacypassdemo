# CLAUDE.md - Privacy Pass Demo Codebase Guide

This document provides a comprehensive overview of the Privacy Pass demo codebase architecture, common commands, and development patterns for future Claude instances working on this project.

## Project Overview

The Privacy Pass demo is an interactive educational application that teaches cryptographic concepts through hands-on examples. It demonstrates how privacy-preserving tokens work using Verifiable Oblivious Pseudorandom Functions (VOPRFs).

### Core Purpose
- Educational demonstration of Privacy Pass protocol
- Interactive step-by-step learning experience
- Visual analogies for complex cryptographic concepts
- Practical implementation of VOPRF protocol

## Technology Stack

### Frontend
- **Framework**: React 19.1.1 with modern hooks
- **Build Tool**: Vite 7.1.2 for fast development and building
- **Language**: JavaScript (ES modules)
- **Styling**: CSS with component-scoped styles

### Backend
- **Runtime**: Node.js 24 (Alpine Linux in Docker)
- **Framework**: Express.js 4.19.2 for API endpoints
- **Architecture**: Stateless RESTful API design

### Cryptography
- **Library**: @noble/curves for elliptic curve operations
- **Curve**: secp256k1 (Bitcoin's curve)
- **Hashing**: @noble/hashes (SHA-256)
- **Cipher**: @noble/ciphers for AES-GCM encryption

### Development Tools
- **Linting**: ESLint 9.33.0 with React plugins
- **Type Checking**: Basic JSDoc annotations
- **Package Manager**: npm with package-lock.json

## Project Structure

```
/Users/iv/Projects/privacypassdemo/
├── src/                           # Frontend React application
│   ├── components/
│   │   ├── steps/                 # 8 educational step components
│   │   │   ├── Step1_Intro.jsx    # Problem introduction
│   │   │   ├── Step2_Goal.jsx     # Anonymous tokens concept
│   │   │   ├── Step3_PKC.jsx      # Public key cryptography
│   │   │   ├── Step4_ECC.jsx      # Elliptic curve cryptography
│   │   │   ├── Step5_OPRF.jsx     # Oblivious functions
│   │   │   ├── Step6_Trust.jsx    # Trust verification
│   │   │   ├── Step7_ZKP.jsx      # Zero-knowledge proofs
│   │   │   └── Step8_FullFlow.jsx # Complete protocol
│   │   ├── interactive/           # Interactive components (empty)
│   │   └── ui/                    # Shared UI components (empty)
│   ├── lib/
│   │   └── crypto.js              # Client-side crypto utilities
│   ├── App.jsx                    # Main application component
│   ├── main.jsx                   # React application entry point
│   └── index.css                  # Global styles
├── server/                        # Backend Express server
│   ├── index.js                   # Main server file with API endpoints
│   └── crypto.js                  # Server-side crypto operations
├── images/                        # Educational diagrams and visuals
├── design/                        # Image generation prompts
├── dist/                          # Built frontend assets
├── public/                        # Static assets
├── tasks/                         # Development task documentation
├── .github/workflows/             # CI/CD configuration
│   └── deploy.yml                 # Automated deployment workflow
├── docker-compose.yml             # Production deployment config
├── Dockerfile                     # Multi-stage Docker build
├── vite.config.js                 # Vite build configuration
├── package.json                   # Dependencies and scripts
├── ARCHITECTURE.md                # Detailed technical specification
├── STEPS.md                       # Educational content specification
└── readme.md                      # Project documentation
```

## Common Commands

### Development
```bash
# Start development server (frontend only)
npm run dev

# Start backend server
npm run start:server

# Full development (run both in separate terminals)
npm run dev        # Terminal 1: Frontend at http://localhost:5173
npm run start:server  # Terminal 2: Backend at http://localhost:3000
```

### Build and Production
```bash
# Build frontend for production
npm run build

# Preview production build locally
npm run preview

# Run production server (serves built frontend + API)
npm run start:server
```

### Code Quality
```bash
# Run ESLint
npm run lint

# Install dependencies
npm install

# Clean install (removes node_modules)
npm ci
```

### Docker Operations
```bash
# Build Docker image
docker build -t privacypassdemo .

# Run with docker-compose (production setup)
docker-compose up -d

# View logs
docker-compose logs -f
```

## Architecture Patterns

### Frontend Architecture
- **Component Structure**: Sequential educational steps (Step1-8)
- **State Management**: React hooks (useState, useEffect) - no global state
- **Rendering Pattern**: All steps rendered together in single page
- **Educational Flow**: Linear progression through cryptographic concepts

### Backend Architecture
- **API Design**: RESTful endpoints following Privacy Pass protocol
- **Stateless Design**: No sessions, cookies, or persistent user data
- **Security Model**: Only maintains used token nonces to prevent double-spending
- **CORS**: Configured for development (localhost:5173)

### API Endpoints

```javascript
// Get server's public key
GET /api/v1/keys
Response: { "publicKey": "hex-encoded-key" }

// Evaluate blinded token (core VOPRF operation)
POST /api/v1/evaluate
Body: { "blindedElement": "hex-string" }
Response: { "evaluatedElement": "hex", "proof": "json-string" }

// Redeem privacy token
POST /api/v1/redeem  
Body: { "token": { "nonce": "string", "output": "hex" } }
Response: { "status": "success" } | { "error": "message" }

// Fallback: Serve React app for any unmatched routes
GET * → index.html (SPA routing)
```

### Cryptographic Implementation

Both `/src/lib/crypto.js` and `/server/crypto.js` implement:

**Core Functions:**
- `blind(token)` - Client-side token blinding
- `unblind(evaluatedToken, blindingFactor)` - Client-side unblinding
- `evaluate(privateKey, blindedElement)` - Server-side VOPRF evaluation
- `generateProof()` - DLEQ zero-knowledge proof generation
- `verifyProof()` - Client-side proof verification
- `encrypt()/decrypt()` - ECIES encryption (Step 3 demo)

**Elliptic Curve Operations:**
- `hashToGroup()` - Hash strings to curve points
- `multiplyPoint()` - Scalar multiplication
- `generatePrivateKey()` - Secure key generation
- `getPublicKey()` - Derive public from private key

## Development Patterns

### File Naming Conventions
- React components: `Step{N}_{Name}.jsx` (PascalCase with numbers)
- Utilities: `crypto.js`, `index.js` (camelCase)
- Documentation: `UPPERCASE.md` for important docs
- Images: `{step}.{sub}.png` (e.g., `1.1.png`, `2.2.png`)

### Code Style
- **ES Modules**: `import`/`export` syntax throughout
- **JSDoc**: Comprehensive function documentation
- **Error Handling**: Try-catch blocks with meaningful error messages
- **Async/Await**: Modern async patterns, especially for crypto operations

### Component Structure
```jsx
// Typical step component pattern
import React from 'react';

const Step{N}_{Name} = () => {
  return (
    <div className="step-container">
      <div className="text-column">
        <h1>Step {N}: Title</h1>
        <h2>Concept: Key Concept</h2>
        <p>Explanation...</p>
        <h2>Analogy: Simple Analogy</h2>
        <p>Analogy explanation...</p>
      </div>
      <div className="animation-column">
        <div id="animation-placeholder-step{N}"></div>
      </div>
    </div>
  );
};

export default Step{N}_{Name};
```

## Deployment Architecture

### CI/CD Pipeline (GitHub Actions)
1. **Trigger**: Push to main branch or manual dispatch
2. **Build**: Docker image with Node.js 24 Alpine
3. **Push**: Image to GitHub Container Registry (ghcr.io)
4. **Deploy**: Updates docker-compose.yml with new image tag
5. **Webhook**: Triggers Portainer for automatic redeployment

### Production Setup
- **Container**: Multi-stage Docker build (builder + production stages)
- **Reverse Proxy**: Traefik with automatic HTTPS (Let's Encrypt)
- **Networking**: External `vaultwarden_default` network
- **Persistence**: No database - stateless design
- **Port**: Container port 3000, external mapping configurable

### Environment Variables
```bash
NODE_ENV=production          # Set in docker-compose
DNS_NAME=${DNS_NAME}        # Domain name for Traefik routing
PORTAINER_REDEPLOY_HOOK     # GitHub Actions secret for deployment
```

## Security Considerations

### Educational vs Production
This is an **educational demo** with simplified security:
- Simplified hash-to-curve implementation (not production-ready)
- Mock proof verification in some scenarios
- In-memory token storage (resets on restart)
- Development CORS settings

### Production Improvements Needed
- Proper hash-to-curve algorithms (RFC 9380)
- Robust random number generation
- Rate limiting and DoS protection
- Secure key management and storage
- Production CORS configuration
- Comprehensive input validation

## Common Debugging Patterns

### Frontend Issues
- Check browser console for crypto errors
- Verify API calls in Network tab
- Ensure backend server is running on port 3000
- Check CORS configuration for cross-origin requests

### Backend Issues
- Check server logs for crypto operation failures
- Verify noble library imports are correct
- Ensure private key generation is working
- Test API endpoints with curl or Postman

### Docker Issues
- Check multi-stage build process
- Verify static asset serving from `/dist`
- Ensure proper file copying in Dockerfile
- Check container port mapping (3000:3000)

## Future Development Guidelines

### Adding New Steps
1. Create `Step{N}_{Name}.jsx` in `/src/components/steps/`
2. Import and add to `App.jsx`
3. Update `STEPS.md` with educational content
4. Add corresponding image to `/images/`
5. Consider adding interactive components to `/src/components/interactive/`

### Enhancing Cryptography
- All crypto changes should be made to both client and server versions
- Add comprehensive tests for new crypto functions
- Update JSDoc documentation thoroughly
- Consider backward compatibility with existing demos

### UI/UX Improvements
- Add components to `/src/components/ui/` for reusable elements
- Maintain educational focus over complex interactions
- Test with users unfamiliar with cryptography
- Keep visual analogies simple and accurate

This guide provides the foundation for understanding and working with the Privacy Pass demo codebase. The project prioritizes educational clarity while maintaining mathematical correctness in its cryptographic implementations.