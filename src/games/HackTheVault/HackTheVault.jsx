import React, { useState, useEffect } from "react";
import "./hackTheVault.css";

const HackTheVault = () => {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [message, setMessage] = useState("Generate a password to hack the vault!");

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let pass = "";
    for (let i = 0; i < 10; i++) {
      pass += chars[Math.floor(Math.random() * chars.length)];
    }
    setPassword(pass);
  };

  useEffect(() => {
    if (password.length === 0) {
      setStrength("");
      return;
    }
    if (password.length < 6) setStrength("Weak");
    else if (password.length < 10) setStrength("Medium");
    else setStrength("Strong");
  }, [password]);

  useEffect(() => {
    if (strength === "Strong") setMessage("🎉 You hacked the vault!");
    else if (strength === "Medium") setMessage("🔐 Almost there, try again!");
    else if (strength === "Weak") setMessage("😅 Too weak, try again!");
  }, [strength]);

  return (
    <div className="vault-container">
      <h1>🔐 Hack the Vault</h1>
      <p>{message}</p>

      <button onClick={generatePassword} className="vault-btn">
        Generate Password
      </button>

      {password && (
        <div className="vault-result">
          <p>Password: <strong>{password}</strong></p>
          <p className={`strength ${strength.toLowerCase()}`}>Strength: {strength}</p>
        </div>
      )}
    </div>
  );
};

export default HackTheVault;

/*
🧠 Logic:
- Randomly generates a password using letters, numbers & symbols.
- Evaluates password strength by length.
- Displays a message like a "game" — you win if it's strong.

⏱️ Time Complexity: O(n)
💾 Space Complexity: O(1)
*/
