import { useState, type FormEvent } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { authErrorMessage } from "../lib/authErrors";

export function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(credential.user);
      }
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-screen">
      <form className="card form auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-title">Tracker Spese</h1>
        <p className="app-subtitle">
          {mode === "login" ? "Accedi al tuo account" : "Crea un nuovo account"}
        </p>

        <div className="form-row">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={6}
              required
            />
          </label>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {mode === "login" ? "Accedi" : "Registrati"}
        </button>

        <button
          type="button"
          className="btn-link"
          onClick={() => {
            setError(null);
            setMode(mode === "login" ? "signup" : "login");
          }}
        >
          {mode === "login"
            ? "Non hai un account? Registrati"
            : "Hai già un account? Accedi"}
        </button>
      </form>
    </div>
  );
}
