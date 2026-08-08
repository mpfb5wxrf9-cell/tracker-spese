import { useState } from "react";
import { sendEmailVerification, signOut, type User } from "firebase/auth";
import { auth } from "../lib/firebase";
import { authErrorMessage } from "../lib/authErrors";

interface Props {
  user: User;
  onCheckVerified: () => Promise<boolean>;
}

export function VerifyEmailScreen({ user, onCheckVerified }: Props) {
  const [status, setStatus] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleCheck() {
    setChecking(true);
    setStatus(null);
    try {
      const verified = await onCheckVerified();
      if (!verified) {
        setStatus("Non ancora verificata: apri la mail e clicca il link, poi riprova.");
      }
    } catch (err) {
      setStatus(authErrorMessage(err));
    } finally {
      setChecking(false);
    }
  }

  async function handleResend() {
    setSending(true);
    setStatus(null);
    try {
      await sendEmailVerification(user);
      setStatus("Email inviata di nuovo.");
    } catch (err) {
      setStatus(authErrorMessage(err));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="card form auth-form">
        <h1 className="auth-title">Verifica la tua email</h1>
        <p className="app-subtitle">
          Ti abbiamo inviato un link di conferma a <strong>{user.email}</strong>. Aprilo per
          continuare.
        </p>

        {status && <p className="auth-error">{status}</p>}

        <button type="button" className="btn-primary" onClick={handleCheck} disabled={checking}>
          Ho verificato, continua
        </button>

        <button type="button" className="btn-secondary" onClick={handleResend} disabled={sending}>
          Invia di nuovo l'email
        </button>

        <button type="button" className="btn-link" onClick={() => signOut(auth)}>
          Esci
        </button>
      </div>
    </div>
  );
}
