import React from 'react';

const Step7_ZKP = () => {
  return (
    <div className="step-container">
      <div className="text-column">
        <h1>Step 7: The Final Piece of Magic - Zero-Knowledge Proofs (ZKP)</h1>
        <p>
          <strong>Concept:</strong> A Zero-Knowledge Proof (ZKP) is a method by which one party (the prover) can prove to another party (the verifier) that they know a value or that a statement is true, without conveying any information apart from the fact that they know the value or the statement is true.
        </p>
        <p>
          <strong>Analogy:</strong> "Where's Wally?". You want to prove to a friend that you know where Wally is in a crowded picture, but you don't want to reveal his location. You take a giant piece of cardboard, much larger than the picture, and cut a small Wally-sized hole in it. You place the cardboard over the picture so that only Wally is visible through the hole. Your friend can look through the hole and see Wally, confirming you know his location. However, because the rest of the picture is obscured, your friend learns absolutely nothing about Wally's position relative to anything else on the page. You have proven your knowledge with zero collateral information leakage.
        </p>
      </div>
      <div className="interactive-column">
        <div className="simulation-container">
          <div className="panel client-panel">
            <h3>Client</h3>
            <div className="verification-status">
              <p>Proof Verification Status: [Placeholder]</p>
            </div>
          </div>
          <div className="panel server-panel">
            <h3>Server</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step7_ZKP;
