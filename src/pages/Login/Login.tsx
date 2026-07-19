import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { extractErrorMessage } from '@/services/api';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTo = (location.state as { from?: Location })?.from?.pathname || '/';

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login({ identifier, password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, 'Não foi possível entrar. Confira seus dados.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card ticket-card">
        <div className="ticket-card__stub">
          <span className="eyebrow auth-card__eyebrow">Bem-vindo de volta</span>
          <h1 className="auth-card__title">Entrar na conta</h1>
          <p className="auth-card__subtitle">Acesse sua biblioteca e continue jogando.</p>
        </div>

        <div className="ticket-divider" />

        <div className="ticket-card__body">
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="form-error-banner">{error}</div>}

            <div className="field">
              <label htmlFor="identifier">Usuário ou e-mail</label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="demo ou demo@smokeair.dev"
              />
            </div>

            <div className="field">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="auth-links-row">
              <Link to="/forgot-password">Esqueceu sua senha?</Link>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="auth-card__footer">
            Ainda não tem conta? <Link to="/register">Criar conta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
