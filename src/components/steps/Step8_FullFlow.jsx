import React, { useState, useCallback } from 'react';
import { blind, unblind, verifyProof } from '../../lib/crypto';

const Step8_FullFlow = () => {
  const [tokens, setTokens] = useState([]);
  const [log, setLog] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addToLog = (message) => {
    setLog((prevLog) => `${message}\n${prevLog}`);
  };

  const handleGenerateTokens = useCallback(async () => {
    setIsLoading(true);
    addToLog('Starting token generation process for 30 tokens...');

    const newTokens = [];
    for (let i = 0; i < 30; i++) {
      try {
        // 1. Generate a random nonce (as a string)
        const nonce = crypto.randomUUID();
        addToLog(`[Token ${i + 1}] Created nonce: ${nonce.substring(0, 8)}...`);

        // 2. Blind the nonce. The `blind` function handles hashing to the curve.
        const { blindedToken, blindingFactor } = blind(nonce);
        addToLog(`[Token ${i + 1}] Blinded nonce.`);

        // 3. Send the blinded element to the server for evaluation
        addToLog(`[Token ${i + 1}] Sending blinded nonce to server...`);
        const response = await fetch('http://localhost:3000/api/v1/evaluate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ blindedElement: blindedToken }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }

        const { evaluatedElement, proof } = await response.json();
        addToLog(`[Token ${i + 1}] Received evaluated element and proof from server.`);

        // 4. Verify the DLEQ proof from the server
        const isProofValid = verifyProof(JSON.parse(proof));
        if (!isProofValid) {
          throw new Error('Invalid DLEQ proof from server.');
        }
        addToLog(`[Token ${i + 1}] DLEQ proof is valid.`);

        // 5. Unblind the evaluated element to get the final signed token
        const signature = unblind(evaluatedElement, blindingFactor);
        addToLog(`[Token ${i + 1}] Unblinded token successfully.`);

        // 6. Store the token (nonce + output)
        const finalToken = { nonce, output: signature };
        newTokens.push(finalToken);

      } catch (error) {
        addToLog(`[Token ${i + 1}] Error: ${error.message}`);
        // Stop the process if one token fails
        break;
      }
    }

    setTokens(newTokens);
    if (newTokens.length === 30) {
      addToLog(`Successfully generated ${newTokens.length} tokens.`);
    } else {
        addToLog(`Token generation process stopped after ${newTokens.length} tokens.`);
    }
    setIsLoading(false);
  }, []);

  const handleSearch = async () => {
    if (tokens.length > 0) {
      const tokenToUse = tokens[0];
      try {
        const response = await fetch('http://localhost:3000/api/v1/redeem', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: tokenToUse }),
        });

        if (response.ok) {
          const newTokens = tokens.slice(1);
          setTokens(newTokens);
          addToLog(`Valid anonymous request received for query: ${searchQuery}`);
          setSearchQuery('');
        } else {
          const errorData = await response.json();
          addToLog(`Error: ${errorData.error}`);
        }
      } catch (error) {
        addToLog(`Error: ${error.message}`);
      }
    } else {
      addToLog('Error: No tokens available. Please generate tokens first.');
    }
  };

  return (
    <div className="step-container step8-container">
      <div className="text-column">
        <h1>Step 8: Putting It All Together - The Full Privacy Pass Flow</h1>
        <h2>Concept: The complete lifecycle of token generation and redemption.</h2>
        <p>
          This final step synthesizes all previous concepts into the full, practical Privacy Pass protocol.
          Click "Generate Tokens" to initiate the flow. Your browser will generate 30 unique nonces,
          blind them, and send them to the server. The server, without knowing the original nonces,
          will sign these blinded tokens and send them back with a cryptographic proof (DLEQ).
          Your browser then verifies the proof and unblinds the tokens, adding them to your wallet.
          This ensures that the server validates your request without linking it to the final token.
        </p>
        <h2>Interaction: A final, full-scale dashboard simulation.</h2>
      </div>
      <div className="dashboard-column">
        <div className="token-wallet">
          <h3>Token Wallet</h3>
          <div className="tokens">
            {tokens.map((token, index) => (
              <div key={index} className="token-icon"></div>
            ))}
          </div>
          <p>{tokens.length} tokens remaining</p>
        </div>
        <div className="controls">
          <button onClick={handleGenerateTokens} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Tokens'}
          </button>
          <div className="search-bar">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Private Search"
            />
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>
        <div className="server-log">
          <h3>Server Log</h3>
          <textarea value={log} readOnly></textarea>
        </div>
      </div>
    </div>
  );
};

export default Step8_FullFlow;
