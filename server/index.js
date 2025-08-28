import express from 'express';
import cors from 'cors';
import { generatePrivateKey, getPublicKey } from '../src/lib/crypto.js';

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Generate a persistent key pair on server startup
const privateKey = generatePrivateKey();
const publicKey = getPublicKey(privateKey);

// API endpoint to get the public key
app.get('/api/v1/keys', (req, res) => {
  res.json({ publicKey });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
