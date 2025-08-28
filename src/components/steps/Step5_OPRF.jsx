import React, { useState, useEffect } from 'react';
import { blind, unblind, generatePrivateKey, evaluate } from '../../lib/crypto';

const Step5_OPRF = () => {
  const [nonce, setNonce] = useState('YourSecretNonce');
  const [blindedToken, setBlindedToken] = useState(null);
  const [blindingFactor, setBlindingFactor] = useState(null);
  const [evaluatedToken, setEvaluatedToken] = useState(null);
  const [finalToken, setFinalToken] = useState(null);
  const [serverPrivateKey, setServerPrivateKey] = useState(null);

  useEffect(() => {
    // Generate a dummy private key for the server when the component mounts
    setServerPrivateKey(generatePrivateKey());
  }, []);

  const handleBlind = () => {
    const { blindedToken, blindingFactor } = blind(nonce);
    setBlindedToken(blindedToken);
    setBlindingFactor(blindingFactor);
  };

  const handleUnblind = () => {
    if (evaluatedToken && blindingFactor) {
      const finalToken = unblind(evaluatedToken, blindingFactor);
      setFinalToken(finalToken);
    }
  };

  const handleEvaluate = () => {
    if (blindedToken && serverPrivateKey) {
      const { evaluatedElement } = evaluate(serverPrivateKey, blindedToken);
      setEvaluatedToken(evaluatedElement);
    }
  };

  return (
    <div className="step-container">
      <div className="text-column">
        <h1>Step 5: The Core Trick - Oblivious Functions & Blind Signatures</h1>
        <h2>Concept: Obliviousness</h2>
        <p>
          This is the heart of the protocol. The client needs to get a piece of data (a token) cryptographically signed or processed by the server, but in a way that the server learns nothing about the data it is processing. This property is known as obliviousness.
        </p>
        <h2>Analogy: The Carbon Paper Envelope</h2>
        <p>
          This powerful analogy, first proposed by David Chaum, perfectly illustrates the concept of a blind signature.
        </p>
        <ul>
          <li><b>Client Prepares:</b> You write a secret message (your random token input, or "nonce") on a piece of paper.</li>
          <li><b>Client Blinds:</b> You place this paper inside a special envelope lined with carbon paper and seal it. The envelope hides your message. This is the "blinding" step.</li>
          <li><b>Interaction:</b> You give the sealed envelope to the Bank (the Server). The Bank cannot see your message inside. It signs the outside of the envelope.</li>
          <li><b>Server Evaluates:</b> The pressure from the pen transfers the signature through the carbon paper onto your secret message. This is the "evaluation" step.</li>
          <li><b>Client Unblinds:</b> The Bank returns the sealed envelope. You open it, take out your message, and discard the envelope. You now possess a message signed by the Bank, but the Bank has never seen the message it signed. This is the "unblinding" step.</li>
        </ul>
      </div>
      <div className="simulation-container">
        <div className="column">
          <h3>Client</h3>
          <p>Nonce (Random Value):</p>
          <input
            type="text"
            value={nonce}
            onChange={(e) => setNonce(e.target.value)}
            className="input-field"
          />
          <button onClick={() => setNonce(Math.random().toString(36).substring(7))}>
            Generate Random Nonce
          </button>
          <button onClick={handleBlind}>Blind</button>
          <p>Blinding Factor:</p>
          <div className="placeholder">{blindingFactor ? blindingFactor.toString() : 'blinding_factor_placeholder'}</div>
          <p>Blinded Token:</p>
          <div className="placeholder">{blindedToken || 'blinded_token_placeholder'}</div>
          <button onClick={handleUnblind}>Unblind</button>
          <p>Final Token:</p>
          <div className="placeholder">{finalToken || 'final_token_placeholder'}</div>
        </div>
        <div className="column">
          <h3>Server</h3>
          <p>Received Blinded Token:</p>
          <div className="placeholder">{blindedToken || 'received_blinded_token_placeholder'}</div>
          <button onClick={handleEvaluate}>Evaluate</button>
          <p>Evaluated Token:</p>
          <div className="placeholder">{evaluatedToken || 'evaluated_token_placeholder'}</div>
        </div>
      </div>
    </div>
  );
};

export default Step5_OPRF;
