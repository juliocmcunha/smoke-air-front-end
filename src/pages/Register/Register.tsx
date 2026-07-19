import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { extractErrorMessage } from '@/services/api';
import type { ApiError } from '@/types/common';
import axios from 'axios';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', displayName: '', email: '', password: '', confirmPassword: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function updateField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    if (form.password !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: 'As senhas não coincidem' });
      return;
    }

    setSubmitting(true);
    try {
      await register({
        username: form.username,
        displayName: form.displayName,
        email: form.email,
        password: form.password,
      });
      navigate('/', { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const apiError = err.response.data as ApiError;
        if (apiError.fieldErrors?.length) {
          const mapped: Record<string, string> = {};
          apiError.fieldErrors.forEach((fe) => (mapped[fe.field] = fe.message));
          setFieldErrors(mapped);
        }
        setError(apiError.message);
      } else {
        setError(extractErrorMessage(err, 'Não foi possível criar sua conta agora.'));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card ticket-card">
        <div className="ticket-card__stub">
          <span className="eyebrow auth-card__eyebrow">Primeira vez por aqui?</span>
          <h1 className="auth-card__title">Criar sua conta</h1>
          <p className="auth-card__subtitle">Leva menos de um minuto.</p>
        </div>

        <div className="ticket-divider" />

        <div className="ticket-card__body">
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {error && <div className="form-error-banner">{error}</div>}

            <div className="field">
              <label htmlFor="displayName">Nome de exibição</label>
              <input
                id="displayName"
                required
                value={form.displayName}
                onChange={(e) => updateField('displayName', e.target.value)}
                placeholder="Como devemos te chamar"
              />
              {fieldErrors.displayName && <span className="field-error">{fieldErrors.displayName}</span>}
            </div>

            <div className="field">
              <label htmlFor="username">Nome de usuário</label>
              <input
                id="username"
                required
                value={form.username}
                onChange={(e) => updateField('username', e.target.value.trim())}
                placeholder="sem espaços, ex: joao_dev"
              />
              {fieldErrors.username && <span className="field-error">{fieldErrors.username}</span>}
            </div>

            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => updateField('email', e.target.value.trim())}
                placeholder="voce@email.com"
              />
              {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
            </div>

            <div className="field">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => updateField('password', e.target.value)}
                placeholder="mínimo 8 caracteres"
              />
              {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
            </div>

            <div className="field">
              <label htmlFor="confirmPassword">Confirmar senha</label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={form.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                placeholder="repita a senha"
              />
              {fieldErrors.confirmPassword && <span className="field-error">{fieldErrors.confirmPassword}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="auth-card__footer">
            Já tem conta? <Link to="/login">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
