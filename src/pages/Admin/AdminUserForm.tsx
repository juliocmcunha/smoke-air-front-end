import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { adminService } from '@/services/adminService';
import { extractErrorMessage } from '@/services/api';
import { Spinner } from '@/components/common/Spinner';
import type { Role } from '@/types/user';
import type { UserStatus } from '@/types/admin';

export function AdminUserForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('USER');
  const [status, setStatus] = useState<UserStatus>('ACTIVE');

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    adminService
      .getUser(Number(id))
      .then((user) => {
        setUsername(user.username);
        setDisplayName(user.displayName);
        setEmail(user.email);
        setRole(user.role);
        setStatus(user.status);
      })
      .catch(() => setError('Não foi possível carregar este usuário.'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (isEditing) {
        await adminService.updateUser(Number(id), { displayName, email, role, status });
      } else {
        await adminService.createUser({ username, displayName, email, password, role });
      }
      navigate('/admin/users');
    } catch (err) {
      setError(extractErrorMessage(err, 'Não foi possível salvar o usuário.'));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner label="Carregando usuário..." />;

  return (
    <div className="admin-form-page">
      <h2 style={{ fontSize: 20, marginBottom: 20 }}>{isEditing ? 'Editar usuário' : 'Novo usuário'}</h2>

      <form className="admin-form" onSubmit={handleSubmit}>
        {error && <div className="form-error-banner">{error}</div>}

        <div className="form-grid">
          {!isEditing && (
            <div className="field">
              <label htmlFor="username">Nome de usuário</label>
              <input id="username" required value={username} onChange={(e) => setUsername(e.target.value.trim())} />
            </div>
          )}

          <div className="field">
            <label htmlFor="displayName">Nome de exibição</label>
            <input id="displayName" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
            />
          </div>

          {!isEditing && (
            <div className="field">
              <label htmlFor="password">Senha inicial</label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="role">Função</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="USER">Usuário</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          {isEditing && (
            <div className="field">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as UserStatus)}
              >
                <option value="ACTIVE">Ativo</option>
                <option value="BLOCKED">Bloqueado</option>
              </select>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar usuário'}
          </button>
          <Link to="/admin/users" className="btn btn-ghost">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
