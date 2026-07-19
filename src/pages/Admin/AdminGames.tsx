import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '@/services/adminService';
import { Spinner } from '@/components/common/Spinner';
import { useDebounce } from '@/utils/useDebounce';
import { extractErrorMessage } from '@/services/api';
import { formatCentsToBRL } from '@/utils/format';
import type { AdminGameSummary } from '@/types/admin';
import type { Page } from '@/types/common';

export function AdminGames() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [page, setPage] = useState(0);
  const [data, setData] = useState<Page<AdminGameSummary> | null>(null);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

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
      .listGames({ search: debouncedSearch || undefined, page, size: 10 })
      .then(setData)
      .catch(() => setBanner({ type: 'error', text: 'Não foi possível carregar os jogos.' }))
      .finally(() => setLoading(false));
  }

  async function handleToggleActive(game: AdminGameSummary) {
    setBusyId(game.id);
    try {
      await adminService.setGameActive(game.id, !game.active);
      load();
    } catch (err) {
      setBanner({ type: 'error', text: extractErrorMessage(err, 'Não foi possível atualizar o jogo.') });
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(game: AdminGameSummary) {
    if (!window.confirm(`Excluir "${game.title}"? Se ele já tiver compras, será apenas desativado.`)) {
      return;
    }
    setBusyId(game.id);
    try {
      const result = await adminService.deleteGame(game.id);
      setBanner({ type: result.hardDeleted ? 'success' : 'error', text: result.message });
      load();
    } catch (err) {
      setBanner({ type: 'error', text: extractErrorMessage(err, 'Não foi possível excluir o jogo.') });
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
          placeholder="Buscar por título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link to="/admin/games/novo" className="btn btn-primary btn-sm">
          + Novo jogo
        </Link>
      </div>

      {loading && <Spinner label="Carregando jogos..." />}

      {!loading && data && data.content.length === 0 && (
        <div className="admin-table-wrap">
          <p className="admin-empty">Nenhum jogo encontrado.</p>
        </div>
      )}

      {!loading && data && data.content.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Jogo</th>
                <th>Preço</th>
                <th>Destaque</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.content.map((game) => (
                <tr key={game.id}>
                  <td>
                    <div className="admin-table__title-cell">
                      {game.coverImageUrl && <img src={game.coverImageUrl} alt="" className="admin-table__thumb" />}
                      <div>
                        <strong>{game.title}</strong>
                        <span>★ {game.averageRating.toFixed(1)}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    {game.discountPercent > 0 ? (
                      <>
                        <span className="price-old">{formatCentsToBRL(game.priceCents)}</span>{' '}
                        {formatCentsToBRL(game.finalPriceCents)}
                      </>
                    ) : (
                      formatCentsToBRL(game.finalPriceCents)
                    )}
                  </td>
                  <td>{game.featured ? <span className="badge badge--gold">Destaque</span> : '—'}</td>
                  <td>
                    <span className={`status-dot ${game.active ? 'status-dot--active' : 'status-dot--inactive'}`}>
                      {game.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        disabled={busyId === game.id}
                        onClick={() => handleToggleActive(game)}
                      >
                        {game.active ? 'Desativar' : 'Reativar'}
                      </button>
                      <Link to={`/admin/games/${game.id}/editar`} className="btn btn-secondary btn-sm">
                        Editar
                      </Link>
                      <button
                        className="btn btn-ghost btn-sm"
                        disabled={busyId === game.id}
                        onClick={() => handleDelete(game)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
