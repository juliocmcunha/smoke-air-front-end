import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '@/services/authService';
import { extractErrorMessage } from '@/services/api';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError('Link de recuperação inválido ou incompleto. Solicite um novo.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await authService.resetPassword(token, password);
      setMessage(response.message);
      setTimeout(() => navigate('/login', { replace: true }), 2500);
    } catch (err) {
      setError(extractErrorMessage(err, 'Não foi possível redefinir sua senha.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card ticket-card">
        <div className="ticket-card__stub">
          <span className="eyebrow auth-card__eyebrow">Quase lá</span>
          <h1 className="auth-card__title">Defina uma nova senha</h1>
          <p className="auth-card__subtitle">Escolha uma senha forte com pelo menos 8 caracteres.</p>
        </div>

        <div className="ticket-divider" />

        <div className="ticket-card__body">
          {!token && <div className="form-error-banner">Link inválido: nenhum token foi encontrado na URL.</div>}

          {message ? (
            <div className="form-success-banner">{message} Redirecionando para o login...</div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              {error && <div className="form-error-banner">{error}</div>}

              <div className="field">
                <label htmlFor="password">Nova senha</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="mínimo 8 caracteres"
                />
              </div>

              <div className="field">
                <label htmlFor="confirmPassword">Confirmar nova senha</label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="repita a senha"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={submitting || !token}>
                {submitting ? 'Salvando...' : 'Redefinir senha'}
              </button>
            </form>
          )}

          <p className="auth-card__footer">
            <Link to="/login">Voltar ao login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
