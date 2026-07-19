import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { libraryService } from '@/services/libraryService';
import { Spinner } from '@/components/common/Spinner';
import { formatPlaytime, formatRelative } from '@/utils/format';
import type { LibraryItem } from '@/types/library';
import './Library.css';

export function Library() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    loadLibrary();
  }, []);

  function loadLibrary() {
    setLoading(true);
    setError(null);
    libraryService
      .getLibrary()
      .then(setItems)
      .catch(() => setError('Não foi possível carregar sua biblioteca agora.'))
      .finally(() => setLoading(false));
  }

  async function handlePlay(item: LibraryItem) {
    setPlayingId(item.gameId);
    try {
      const updated = await libraryService.recordPlaySession(item.gameId, 30);
      setItems((prev) => prev.map((i) => (i.gameId === item.gameId ? updated : i)));
    } catch {
      // silenciosamente ignora — não é crítico numa demonstração
    } finally {
      setPlayingId(null);
    }
  }

  const filteredItems = items.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
  const totalPlaytime = items.reduce((sum, item) => sum + item.playtimeMinutes, 0);

  return (
    <div className="library-page container">
      <div className="library-header">
        <div>
          <h1>Minha biblioteca</h1>
          <p>
            {items.length} {items.length === 1 ? 'jogo' : 'jogos'} · {formatPlaytime(totalPlaytime)} no total
          </p>
        </div>
        <input
          className="library-search"
          type="search"
          placeholder="Buscar na biblioteca..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading && <Spinner label="Carregando sua biblioteca..." />}

      {!loading && error && (
        <div className="empty-state">
          <h3>Não deu para carregar sua biblioteca</h3>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="empty-state">
          <h3>Sua biblioteca está vazia</h3>
          <p>Os jogos que você comprar vão aparecer aqui.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>
            Ir para a loja
          </Link>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="library-grid">
          {filteredItems.map((item) => (
            <div key={item.libraryItemId} className="library-card">
              <Link to={`/jogo/${item.slug}`} className="library-card__cover-wrap">
                {item.coverImageUrl && <img src={item.coverImageUrl} alt={`Capa de ${item.title}`} />}
              </Link>
              <div className="library-card__info">
                <Link to={`/jogo/${item.slug}`}>
                  <h3>{item.title}</h3>
                </Link>
                <p className="library-card__meta">{formatPlaytime(item.playtimeMinutes)}</p>
                <p className="library-card__meta library-card__meta--muted">
                  Última sessão: {item.lastPlayedAt ? formatRelative(item.lastPlayedAt) : 'ainda não jogado'}
                </p>
                <button
                  className="btn btn-secondary btn-sm btn-block"
                  onClick={() => handlePlay(item)}
                  disabled={playingId === item.gameId}
                >
                  {playingId === item.gameId ? 'Iniciando...' : '▶ Jogar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
