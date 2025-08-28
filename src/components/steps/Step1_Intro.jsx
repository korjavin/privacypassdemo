import React from 'react';

const Step1_Intro = () => {
  return (
    <div className="step-container">
      <div className="text-column">
        <h1>Step 1: The Problem - A World of Digital Passports</h1>
        <h2>Concept: Authentication vs. Identification</h2>
        <p>
          The fundamental problem is that on the traditional web, proving you have the right to access a service (authentication) is almost always bundled with proving who you are (identification).
        </p>
        <h2>Analogy: The "Digital Passport"</h2>
        <p>
          We introduce the "Digital Passport." When you log into a service or accept its cookies, it's like handing over a passport. Every action you take—every page you visit, every item you click—gets a "stamp." Over time, various services and third-party trackers can piece together these stamps to build an incredibly detailed profile of your life, a concern echoed in early privacy protocol designs.<sup>1</sup> This is efficient for services but devastating for privacy.
        </p>
      </div>
      <div className="animation-column">
        <img src="/images/1.1.png" alt="Digital Passport Analogy - User activity being tracked and compiled into detailed profiles by data brokers" className="step-image" />
      </div>
    </div>
  );
};

export default Step1_Intro;
