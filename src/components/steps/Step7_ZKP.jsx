import React, { useState, useEffect } from 'react';
import { blind, unblind, verifyProof } from '../../lib/crypto';
import { secp256k1 } from '@noble/curves/secp256k1';

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

  const handleBlind = () => {
    const nonce = `nonce-${Date.now()}`;
    setClientNonce(nonce);
    const { blindedToken, blindingFactor } = blind(nonce);
    setBlindedToken(blindedToken);
    setBlindingFactor(blindingFactor);

    // Simulate sending to server and receiving response
    // In a real app, this would be an API call
    handleEvaluate(blindedToken);
  };

  const handleEvaluate = (token) => {
    // This is a mock of the server's evaluation
    const M = secp256k1.ProjectivePoint.fromHex(token);
    // The server would have a private key, but we'll use the public key for simulation
    // This is NOT how it would work in reality. We are just simulating the point multiplication.
    const Z = M.multiply(BigInt(12345)); // Dummy private key
    setEvaluatedElement(Z.toHex());

    // Mock proof
    const mockProof = { data: 'mock-proof' };
    setProof(mockProof);

    const isValid = verifyProof(mockProof, isMalicious);
    setVerificationStatus(isValid ? 'Success' : 'Failure');
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
