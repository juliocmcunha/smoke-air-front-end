import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '@/services/authService';
import { extractErrorMessage } from '@/services/api';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      const response = await authService.forgotPassword(email);
      setMessage(response.message);
    } catch (err) {
      setError(extractErrorMessage(err, 'Não foi possível enviar o e-mail agora.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card ticket-card">
        <div className="ticket-card__stub">
          <span className="eyebrow auth-card__eyebrow">Recuperar acesso</span>
          <h1 className="auth-card__title">Esqueceu sua senha?</h1>
          <p className="auth-card__subtitle">
            Informe o e-mail da sua conta e enviaremos um link para redefinir a senha.
          </p>
        </div>

        <div className="ticket-divider" />

        <div className="ticket-card__body">
          {message ? (
            <div className="form-success-banner">{message}</div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              {error && <div className="form-error-banner">{error}</div>}

              <div className="field">
                <label htmlFor="email">E-mail cadastrado</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@email.com"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? 'Enviando...' : 'Enviar link de recuperação'}
              </button>
            </form>
          )}

          <p className="auth-card__footer">
            Lembrou a senha? <Link to="/login">Voltar ao login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
