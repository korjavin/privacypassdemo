import express from 'express';
import cors from 'cors';
import {
  generatePrivateKey,
  getPublicKey,
  hashToGroup,
  multiplyPoint,
  pointToHex,
} from '../src/lib/crypto.js';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Enable parsing of JSON request bodies

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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
