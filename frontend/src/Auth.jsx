
import { useState } from "react";
import "./Auth.css";

const API_URL = "http://localhost:5000/api/auth";

export default function Auth({ onLogin, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "login" : "register";

      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      if (isLogin) {
        onLogin(data);
      } else {
        setMessage("Registration successful! Please log in.");
        setIsLogin(true);
        setPassword("");
      }
    } catch (error) {
      setMessage(error.message || "Unable to connect to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-overlay">
      <div className="auth-box">
        <button
          type="button"
          className="auth-close"
          onClick={onClose}
        >
          ×
        </button>

        <h2>{isLogin ? "Welcome Back!" : "Create Account"}</h2>
        <p>
          {isLogin
            ? "Log in to manage your projects."
            : "Join the Student Project Showcase."}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password (minimum 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          <button type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Register"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-switch">
          {isLogin ? "Don't have an account?" : "Already registered?"}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
