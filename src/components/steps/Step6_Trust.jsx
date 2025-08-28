import React, { useState } from 'react';

const Step6_Trust = () => {
  const [isHonest, setIsHonest] = useState(true);
  const [serverKey, setServerKey] = useState(null);
  const [isTokenSigned, setIsTokenSigned] = useState(false);
  const [tokenState, setTokenState] = useState('unsigned'); // unsigned, signed-honest, signed-malicious
  const [verificationStatus, setVerificationStatus] = useState(null); // null, 'Success', 'Failure'

  const handleSign = () => {
    setServerKey(isHonest ? 'Public Key' : 'Secret Tracking Key');
    setIsTokenSigned(true);
    setTokenState(isHonest ? 'signed-honest' : 'signed-malicious');
    setVerificationStatus(null); // Reset verification status on new signature
  };

  const handleVerify = () => {
    if (serverKey === 'Public Key') {
      setVerificationStatus('Success');
    } else {
      setVerificationStatus('Failure');
    }
  };

  return (
    <div className="step-container">
      <div className="text-column">
        <h1>Step 6: The Trust Problem - Is the Bank Using the Right Pen?</h1>
        <p>
          <strong>Concept:</strong> Verifiability. The blind signature process is powerful, but it has a potential flaw. What if the server (the Bank) is malicious? It could use a different secret key (a different "pen") for each user. For example, it uses a standard blue ink pen for everyone else, but a special red ink pen just for you. Later, when you spend your signed token, the server sees the red ink and knows it must have come from you, completely destroying the unlinkability and privacy guarantees. The client needs a way to verify that the server used the correct, public key for the signing.
        </p>
        <p>
          <strong>Analogy:</strong> The "Two Pens" problem. The Bank has its official, publicly-known signing pen. How can it prove to you that it used that specific pen to sign your carbon-paper envelope, without you ever seeing the pen or the signature happen? It needs to provide some extra proof that the signature it created is linked to the official pen and not some other secret tracking pen.
        </p>
      </div>
      <div className="interactive-column">
        <div className="server-panel">
          <h3>Server Panel</h3>
          <div className="toggle-switch">
            <label>
              <input
                type="checkbox"
                checked={isHonest}
                onChange={() => setIsHonest(!isHonest)}
              />
              <span className="slider"></span>
            </label>
            <span className="toggle-label">
              {isHonest ? 'Honest Mode' : 'Malicious Mode'}
            </span>
          </div>

          <div className="pens-container">
            <div className={`pen ${isHonest ? 'active' : ''}`}>
              <div className="pen-icon honest"></div>
              <span>Public Key</span>
            </div>
            <div className={`pen ${!isHonest ? 'active' : ''}`}>
              <div className="pen-icon malicious"></div>
              <span>Tracking Key</span>
            </div>
          </div>

          <button onClick={handleSign} className="btn">
            Sign Token
          </button>
          {isTokenSigned && (
            <div className="simulation-status">
              <p>Server used: <strong>{serverKey}</strong></p>
              <p>The server sends the evaluated token back to the client.</p>
            </div>
          )}
        </div>
        <div className="client-panel">
          <h3>Client Panel</h3>
          <div className="token-area">
            <div className={`token ${tokenState}`}>
              <span className="token-label">Token</span>
              {verificationStatus === 'Success' && <div className="verification-icon success">✓</div>}
              {verificationStatus === 'Failure' && <div className="verification-icon failure">✗</div>}
            </div>
          </div>
          <button onClick={handleVerify} disabled={!isTokenSigned} className="btn">
            Verify Server's Key
          </button>
          {verificationStatus && (
            <div className="simulation-status">
              <p>Verification Result: <span className={verificationStatus === 'Success' ? 'success' : 'failure'}>{verificationStatus}</span></p>
              {verificationStatus === 'Success' && (
                <p>The client confirms that the server used its public key. The process is secure.</p>
              )}
              {verificationStatus === 'Failure' && (
                <p>The client detects that the server used a different key! The token is invalid and the server's malicious attempt is foiled.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step6_Trust;
