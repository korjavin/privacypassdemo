import React, { useState, useEffect } from 'react';
import { bytesToHex, hexToBytes } from '@noble/curves/abstract/utils';
import { generatePrivateKey, getPublicKey, encrypt, decrypt } from '../../lib/crypto';

const Step3_PKC = () => {
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [message, setMessage] = useState('');
  const [ciphertext, setCiphertext] = useState('');

  useEffect(() => {
    const newPrivateKey = generatePrivateKey();
    const newPublicKey = getPublicKey(newPrivateKey);
    setPrivateKey(bytesToHex(newPrivateKey));
    setPublicKey(newPublicKey);
  }, []);

  const handleEncrypt = async () => {
    try {
      const encryptedMessage = await encrypt(publicKey, message);
      setCiphertext(encryptedMessage);
    } catch (error) {
      console.error("Encryption failed:", error);
      alert("Encryption failed. See console for details.");
    }
  };

  const handleDecrypt = async () => {
    try {
      const decryptedMessage = await decrypt(hexToBytes(privateKey), ciphertext);
      setMessage(decryptedMessage);
    } catch (error) {
      console.error("Decryption failed:", error);
      alert("Decryption failed. It's possible the private key doesn't match the public key used for encryption. See console for details.");
    }
  };

  return (
    <div className="step-container">
      <div className="text-column">
        <h1>Step 3: The First Piece of Magic - Public Key Cryptography</h1>
        <h2>Concept: Asymmetric Keys and Trapdoor Functions</h2>
        <p>
          Before diving into the main protocol, we must establish the foundational concept of public-key cryptography. This class of cryptography relies on "trapdoor" functions: mathematical problems that are easy to compute in one direction but intractable to reverse.<sup>9</sup>
        </p>
        <h2>Analogy: The "Padlock and Key"</h2>
        <p>
          A user has a unique padlock (their public key) and a single, corresponding key (their private key). They can mass-produce the padlock and give it to everyone. Anyone can snap the padlock shut on a box, but only the person with the one-of-a-kind private key can open it.<sup>10</sup> This establishes the core public/private key relationship and the one-way nature of encryption.
        </p>
      </div>
      <div className="interactive-column">
        <h3>Interactive Module: Padlock and Key</h3>
        <div className="key-pair">
          <textarea
            className="key-box"
            placeholder="Public Key (the Padlock)"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            rows="4"
          />
          <textarea
            className="key-box"
            placeholder="Private Key (the Key)"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            rows="4"
          />
        </div>
        <div className="message-area">
          <input
            type="text"
            placeholder="Enter your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleEncrypt}>Encrypt</button>
        </div>
        <div className="ciphertext-area">
          <textarea
            readOnly
            placeholder="Ciphertext will appear here..."
            value={ciphertext}
            rows="4"
          />
          <button onClick={handleDecrypt}>Decrypt</button>
        </div>
      </div>
    </div>
  );
};

export default Step3_PKC;
