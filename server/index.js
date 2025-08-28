// Task g4_task_12: Implement backend /api/v1/keys endpoint
import express from 'express';
import cors from 'cors';
import path from 'path';
import {
  generatePrivateKey,
  getPublicKey,
  hashToGroup,
  multiplyPoint,
  pointToHex,
  evaluate,
  generateProof
} from './crypto.js';

const app = express();
const port = 3000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json()); // Enable parsing of JSON request bodies

// Serve static files
app.use(express.static('dist'));
app.use('/images', express.static('images'));

// Server state
const privateKey = generatePrivateKey();
const publicKey = getPublicKey(privateKey);
const usedNonces = new Set(); // To prevent token reuse

// API endpoint to get the public key
app.get('/api/v1/keys', (req, res) => {
  res.json({ publicKey });
});

// API endpoint to redeem a token
app.post('/api/v1/redeem', (req, res) => {
  const { token } = req.body;

  // 1. Validate request body
  if (!token || !token.nonce || !token.output) {
    return res.status(400).json({ error: 'Invalid token format.' });
  }

  const { nonce, output } = token;

  // 2. Check if nonce has already been used
  if (usedNonces.has(nonce)) {
    return res.status(400).json({ error: 'Token invalid or already used.' });
  }

  try {
    // 3. Re-compute the expected output
    const noncePoint = hashToGroup(nonce);
    const expectedOutputPoint = multiplyPoint(noncePoint, privateKey);
    const expectedOutput = pointToHex(expectedOutputPoint);

    // 4. Compare with the provided output
    if (expectedOutput === output) {
      // 5. If valid, mark nonce as used and send success response
      usedNonces.add(nonce);
      res.json({ status: 'success' });
    } else {
      // If invalid, send error response
      res.status(400).json({ error: 'Token invalid or already used.' });
    }
  } catch (error) {
    console.error('Error during token verification:', error);
    res.status(500).json({ error: 'Internal server error during token verification.' });
  }
});

// API endpoint to evaluate a blinded element
app.post('/api/v1/evaluate', (req, res) => {
  const { blindedElement } = req.body;

  if (!blindedElement) {
    return res.status(400).json({ error: 'blindedElement is required' });
  }

  try {
    // 1. Evaluate the blinded element
    const { blindedPoint, evaluatedPoint, evaluatedElement } = evaluate(privateKey, blindedElement);

    // 2. Generate the DLEQ proof
    const proof = generateProof(privateKey, blindedPoint, evaluatedPoint);

    // 3. Respond with the evaluated element and the proof
    res.json({
      evaluatedElement,
      proof,
    });
  } catch (error) {
    // It's good practice to avoid sending detailed error messages to the client.
    console.error('Evaluation failed:', error.message);
    res.status(500).json({ error: 'Failed to evaluate blinded element. The provided element may be invalid.' });
  }
});

// Serve index.html for root route and any unmatched routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
