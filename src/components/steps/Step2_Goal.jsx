import React from 'react';

const Step2_Goal = () => {
  return (
    <div className="step-container">
      <div className="text-column">
        <h1>Step 2: The Goal - Anonymous Access Tokens</h1>
        <h2>Concept: Unlinkable Authorization</h2>
        <p>
          The goal is to separate authentication from the final act of accessing a service (authorization). We want a system where the server can verify that a request is legitimate without being able to link it to a specific user account.
        </p>
        <h2>Analogy: The "Anonymous Movie Ticket"</h2>
        <p>
          Imagine two scenarios. In the first, you buy a movie ticket with a credit card, and your seat number is tied to your name. When the usher scans your ticket, the system knows exactly who you are. In the second, superior scenario, you pay with cash (proving you're a legitimate customer) and receive a generic, anonymous ticket. The usher validates the ticket but has no idea who you are, only that you hold a valid pass. This is the core promise of Privacy Pass: to turn digital access rights into anonymous, untraceable tokens.<sup>2</sup>
        </p>
      </div>
      <div className="interactive-column">
        <img src="/images/1.2.png" alt="Anonymous Movie Tickets - Comparison between traceable tokens with serial numbers and anonymous tokens" className="step-image" />
      </div>
    </div>
  );
};

export default Step2_Goal;
