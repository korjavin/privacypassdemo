import React, { useState } from 'react';

const Step8_FullFlow = () => {
  const [tokens, setTokens] = useState([]);
  const [log, setLog] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleGenerateTokens = () => {
    const newTokens = Array.from({ length: 30 }, (_, i) => `token-${i + 1}`);
    setTokens(newTokens);
    setLog('Generated 30 tokens.\n' + log);
  };

  const handleSearch = () => {
    if (tokens.length > 0) {
      const newTokens = tokens.slice(1);
      setTokens(newTokens);
      setLog(`Valid anonymous request received for query: ${searchQuery}\n` + log);
      setSearchQuery('');
    } else {
      setLog('Error: No tokens available. Please generate tokens first.\n' + log);
    }
  };

  return (
    <div className="step-container step8-container">
      <div className="text-column">
        <h1>Step 8: Putting It All Together - The Full Privacy Pass Flow</h1>
        <h2>Concept: The complete lifecycle of token generation and redemption.</h2>
        <p>
          This final step synthesizes all previous concepts into the full, practical Privacy Pass protocol.
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
          <button onClick={handleGenerateTokens}>Generate Tokens</button>
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
