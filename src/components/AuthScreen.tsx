import { useEffect, useState, type FormEvent } from "react";
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { authErrorMessage } from "../lib/authErrors";

// iOS home-screen "standalone" web apps don't reliably return from a
// Google OAuth redirect (the pending sign-in state can be lost when
// Safari hands control back to the installed app shell), so Google
// sign-in is offered as a link that opens in real Safari instead.
function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

export function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [standalone] = useState(isStandalone);

  // Picks up errors from a signInWithRedirect flow (e.g. the user cancelled
  // on Google's side) once the app reloads after coming back from Google.
  useEffect(() => {
    getRedirectResult(auth).catch((err) => setError(authErrorMessage(err)));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    try {
      // Redirects the whole page to Google's sign-in and back, rather than a
      // popup: popups are unreliable on iOS Safari (they can be closed
      // immediately, especially when the app is installed to the home screen).
      await signInWithRedirect(auth, googleProvider);
    } catch (err) {
      // Only reachable if the redirect itself couldn't start (e.g. this
      // domain isn't in Firebase's authorized domains list) - a successful
      // redirect navigates away before this line would run.
      setError(authErrorMessage(err));
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

        {standalone ? (
          <p className="auth-note">
            L'accesso con Google non è affidabile nell'app installata su iPhone.{" "}
            <a href={window.location.href} target="_blank" rel="noopener noreferrer">
              Apri questo link in Safari
            </a>{" "}
            per usarlo, oppure accedi con email e password qui sopra.
          </p>
        ) : (
          <button
            type="button"
            className="btn-google"
            onClick={handleGoogle}
            disabled={submitting}
          >
            Continua con Google
          </button>
        )}

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
