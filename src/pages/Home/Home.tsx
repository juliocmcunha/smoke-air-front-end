import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { gameService } from '@/services/gameService';
import { GameShelf } from '@/components/game/GameShelf';
import { GameGrid } from '@/components/game/GameGrid';
import { Spinner } from '@/components/common/Spinner';
import { formatCentsToBRL } from '@/utils/format';
import type { Category, GameSummary } from '@/types/game';
import type { Page } from '@/types/common';
import './Home.css';

const PAGE_SIZE = 12;

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('busca') ?? '';
  const category = searchParams.get('categoria') ?? '';
  const page = Number(searchParams.get('pagina') ?? '0');

  const [featured, setFeatured] = useState<GameSummary[]>([]);
  const [heroBanner, setHeroBanner] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [catalog, setCatalog] = useState<Page<GameSummary> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    gameService.featured().then(setFeatured).catch(() => setFeatured([]));
    gameService.listCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!featured[0]) return;
    // O resumo só traz a capa (retrato); buscamos o detalhe para pegar o banner (paisagem) do hero.
    gameService
      .getBySlug(featured[0].slug)
      .then((detail) => setHeroBanner(detail.bannerImageUrl))
      .catch(() => setHeroBanner(null));
  }, [featured]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    gameService
      .search({ search: search || undefined, category: category || undefined, page, size: PAGE_SIZE })
      .then(setCatalog)
      .catch(() => setError('Não foi possível carregar o catálogo agora. Confira se o back-end está rodando.'))
      .finally(() => setLoading(false));
  }, [search, category, page]);

  const isFiltering = Boolean(search || category);
  const hero = featured[0];

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('pagina');
    setSearchParams(next);
  }

  function goToPage(nextPage: number) {
    const next = new URLSearchParams(searchParams);
    next.set('pagina', String(nextPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="home">
      {!isFiltering && hero && (
        <section className="hero" style={{ backgroundImage: `url(${heroBanner ?? hero.coverImageUrl ?? ''})` }}>
          <div className="hero__scrim" />
          <div className="container hero__content">
            <span className="eyebrow">Destaque da semana</span>
            <h1 className="hero__title">{hero.title}</h1>
            {hero.shortDescription && <p className="hero__desc">{hero.shortDescription}</p>}
            <div className="hero__actions">
              <Link to={`/jogo/${hero.slug}`} className="btn btn-primary">
                Ver detalhes
              </Link>
              <span className="price-tag price-tag--discount hero__price">
                {hero.discountPercent > 0 && <span className="price-old">{formatCentsToBRL(hero.priceCents)}</span>}
                {formatCentsToBRL(hero.finalPriceCents)}
              </span>
            </div>
          </div>
        </section>
      )}

      <div className="container">
        {!isFiltering && featured.length > 1 && (
          <GameShelf title="Em destaque" subtitle="Selecionados pela curadoria da loja" games={featured} />
        )}

        <section className="catalog">
          <div className="catalog__header">
            <div>
              <h2>{isFiltering ? 'Resultados da busca' : 'Catálogo completo'}</h2>
              {search && <p>Buscando por “{search}”</p>}
            </div>

            <div className="catalog__chips">
              <button
                className={`chip ${!category ? 'chip--active' : ''}`}
                onClick={() => updateParam('categoria', '')}
              >
                Todas
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  className={`chip ${category === c.slug ? 'chip--active' : ''}`}
                  onClick={() => updateParam('categoria', c.slug)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {loading && <Spinner label="Carregando jogos..." />}

          {!loading && error && (
            <div className="empty-state">
              <h3>Não deu para carregar o catálogo</h3>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && catalog && catalog.content.length === 0 && (
            <div className="empty-state">
              <h3>Nenhum jogo encontrado</h3>
              <p>Tente outra busca ou remova o filtro de categoria.</p>
            </div>
          )}

          {!loading && !error && catalog && catalog.content.length > 0 && (
            <>
              <GameGrid games={catalog.content} />

              {catalog.totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-ghost btn-sm"
                    disabled={catalog.first}
                    onClick={() => goToPage(page - 1)}
                  >
                    ← Anterior
                  </button>
                  <span>
                    Página {catalog.number + 1} de {catalog.totalPages}
                  </span>
                  <button className="btn btn-ghost btn-sm" disabled={catalog.last} onClick={() => goToPage(page + 1)}>
                    Próxima →
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
