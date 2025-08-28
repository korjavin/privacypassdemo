import React, { useState } from 'react';
import './Step6_Trust.css';

const Step6_Trust = () => {
  const [isHonest, setIsHonest] = useState(true);

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
              {isHonest ? 'Honest Mode (Uses Public Key)' : 'Malicious Mode (Uses Tracking Key)'}
            </span>
          </div>
        </div>
        {/* Placeholder for the rest of the simulation */}
      </div>
    </div>
  );
};

export default Step6_Trust;
