import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '@/services/adminService';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/common/Spinner';
import { useDebounce } from '@/utils/useDebounce';
import { extractErrorMessage } from '@/services/api';
import { formatDate } from '@/utils/format';
import type { AdminUserSummary } from '@/types/admin';
import type { Page } from '@/types/common';

export function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [page, setPage] = useState(0);
  const [data, setData] = useState<Page<AdminUserSummary> | null>(null);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [resettingId, setResettingId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page]);

  function load() {
    setLoading(true);
    adminService
      .listUsers({ search: debouncedSearch || undefined, page, size: 10 })
      .then(setData)
      .catch(() => setBanner({ type: 'error', text: 'Não foi possível carregar os usuários.' }))
      .finally(() => setLoading(false));
  }

  async function handleDelete(targetUser: AdminUserSummary) {
    if (!window.confirm(`Excluir a conta de "${targetUser.username}"? Essa ação não pode ser desfeita.`)) {
      return;
    }
    setBusyId(targetUser.id);
    try {
      await adminService.deleteUser(targetUser.id);
      setBanner({ type: 'success', text: `Conta de ${targetUser.username} excluída.` });
      load();
    } catch (err) {
      setBanner({ type: 'error', text: extractErrorMessage(err, 'Não foi possível excluir esse usuário.') });
    } finally {
      setBusyId(null);
    }
  }

  async function handleResetPassword(targetUser: AdminUserSummary) {
    if (newPassword.length < 8) {
      setBanner({ type: 'error', text: 'A nova senha precisa ter pelo menos 8 caracteres.' });
      return;
    }
    setBusyId(targetUser.id);
    try {
      await adminService.resetUserPassword(targetUser.id, newPassword);
      setBanner({ type: 'success', text: `Senha de ${targetUser.username} redefinida.` });
      setResettingId(null);
      setNewPassword('');
    } catch (err) {
      setBanner({ type: 'error', text: extractErrorMessage(err, 'Não foi possível redefinir a senha.') });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      {banner && (
        <div className={banner.type === 'success' ? 'form-success-banner' : 'form-error-banner'} style={{ marginBottom: 18 }}>
          {banner.text}
        </div>
      )}

      <div className="admin-toolbar">
        <input
          type="search"
          placeholder="Buscar por nome, usuário ou e-mail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link to="/admin/users/novo" className="btn btn-primary btn-sm">
          + Novo usuário
        </Link>
      </div>

      {loading && <Spinner label="Carregando usuários..." />}

      {!loading && data && data.content.length === 0 && (
        <div className="admin-table-wrap">
          <p className="admin-empty">Nenhum usuário encontrado.</p>
        </div>
      )}

      {!loading && data && data.content.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>E-mail</th>
                <th>Função</th>
                <th>Status</th>
                <th>Desde</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.content.map((u) => {
                const isSelf = u.id === currentUser?.id;
                return (
                  <Fragment key={u.id}>
                    <tr>
                      <td>
                        <div className="admin-table__title-cell">
                          <div>
                            <strong>{u.displayName}</strong>
                            <span>@{u.username}</span>
                          </div>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-tag ${u.role === 'ADMIN' ? 'role-tag--admin' : ''}`}>{u.role}</span>
                      </td>
                      <td>
                        <span className={`status-dot ${u.status === 'ACTIVE' ? 'status-dot--active' : 'status-dot--inactive'}`}>
                          {u.status === 'ACTIVE' ? 'Ativo' : 'Bloqueado'}
                        </span>
                      </td>
                      <td>{formatDate(u.createdAt)}</td>
                      <td>
                        <div className="admin-table__actions">
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => {
                              setResettingId(resettingId === u.id ? null : u.id);
                              setNewPassword('');
                            }}
                          >
                            Redefinir senha
                          </button>
                          {!isSelf && (
                            <Link to={`/admin/users/${u.id}/editar`} className="btn btn-secondary btn-sm">
                              Editar
                            </Link>
                          )}
                          {!isSelf && (
                            <button className="btn btn-ghost btn-sm" disabled={busyId === u.id} onClick={() => handleDelete(u)}>
                              Excluir
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {resettingId === u.id && (
                      <tr>
                        <td colSpan={6}>
                          <div className="inline-reset-form">
                            <input
                              type="password"
                              placeholder="Nova senha (mín. 8 caracteres)"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                              className="btn btn-primary btn-sm"
                              disabled={busyId === u.id}
                              onClick={() => handleResetPassword(u)}
                            >
                              Salvar
                            </button>
                            <button className="btn btn-ghost btn-sm" onClick={() => setResettingId(null)}>
                              Cancelar
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!loading && data && data.totalPages > 1 && (
        <div className="pagination">
          <button className="btn btn-ghost btn-sm" disabled={data.first} onClick={() => setPage((p) => p - 1)}>
            ← Anterior
          </button>
          <span>
            Página {data.number + 1} de {data.totalPages}
          </span>
          <button className="btn btn-ghost btn-sm" disabled={data.last} onClick={() => setPage((p) => p + 1)}>
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
}
