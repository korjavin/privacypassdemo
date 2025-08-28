import React, { useState, useEffect } from 'react';
import { blind, unblind, verifyProof } from '../../lib/crypto';

const Step7_ZKP = () => {
  const [serverPublicKey, setServerPublicKey] = useState(null);
  const [clientNonce, setClientNonce] = useState('');
  const [blindingFactor, setBlindingFactor] = useState(null);
  const [blindedToken, setBlindedToken] = useState(null);
  const [evaluatedElement, setEvaluatedElement] = useState(null);
  const [proof, setProof] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('N/A');
  const [finalToken, setFinalToken] = useState(null);
  const [isMalicious, setIsMalicious] = useState(false);

  useEffect(() => {
    const fetchPublicKey = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/keys');
        const data = await response.json();
        setServerPublicKey(data.publicKey);
      } catch (error) {
        console.error('Error fetching public key:', error);
      }
    };
    fetchPublicKey();
  }, []);

  const handleBlind = async () => {
    const nonce = `nonce-${Date.now()}`;
    setClientNonce(nonce);
    const { blindedToken, blindingFactor } = blind(nonce);
    setBlindedToken(blindedToken);
    setBlindingFactor(blindingFactor);

    // This is now a real API call to the server
    await handleEvaluate(blindedToken);
  };

  const handleEvaluate = async (token) => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blindedElement: token }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEvaluatedElement(data.evaluatedElement);
      // The proof from the server is a JSON string, so we need to parse it
      const parsedProof = JSON.parse(data.proof);
      setProof(parsedProof);

      const isValid = verifyProof(parsedProof, isMalicious);
      setVerificationStatus(isValid ? 'Success' : 'Failure');
    } catch (error) {
      console.error('Error during evaluation:', error);
      setVerificationStatus('Error');
    }
  };

  const handleUnblind = () => {
    if (verificationStatus === 'Success') {
      const final = unblind(evaluatedElement, blindingFactor);
      setFinalToken(final);
    }
  };

  return (
    <div className="step-container">
      <div className="text-column">
        <h1>Step 7: The Final Piece of Magic - Zero-Knowledge Proofs (ZKP)</h1>
        <p>
          This simulation demonstrates the VOPRF flow with a Zero-Knowledge Proof.
        </p>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={isMalicious}
              onChange={() => setIsMalicious(!isMalicious)}
            />
            Malicious Mode (Server sends bad proof)
          </label>
        </div>
      </div>
      <div className="interactive-column">
        <div className="simulation-container">
          <div className="panel client-panel">
            <h3>Client</h3>
            <button onClick={handleBlind} disabled={!serverPublicKey}>Blind</button>
            <button onClick={handleUnblind} disabled={verificationStatus !== 'Success'}>Unblind</button>
            <div className="data-display">
              <p><strong>Nonce:</strong> {clientNonce}</p>
              <p><strong>Blinding Factor (r):</strong> {blindingFactor?.toString()}</p>
              <p><strong>Blinded Token (M):</strong> {blindedToken}</p>
              <p><strong>Final Token (N):</strong> {finalToken}</p>
            </div>
            <div className="verification-status">
              <p>Proof Verification Status: {verificationStatus}</p>
            </div>
          </div>
          <div className="panel server-panel">
            <h3>Server</h3>
            <div className="data-display">
              <p><strong>Public Key (Y):</strong> {serverPublicKey}</p>
              <p><strong>Evaluated Element (Z):</strong> {evaluatedElement}</p>
              <p><strong>Proof:</strong> {JSON.stringify(proof)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step7_ZKP;
