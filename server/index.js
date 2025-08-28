import express from 'express';
import cors from 'cors';
import { generatePrivateKey, getPublicKey, evaluate, generateProof } from '../src/lib/crypto.js';

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Generate a persistent key pair on server startup
const privateKey = generatePrivateKey();
const publicKey = getPublicKey(privateKey);

// API endpoint to get the public key
app.get('/api/v1/keys', (req, res) => {
  res.json({ publicKey });
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


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
