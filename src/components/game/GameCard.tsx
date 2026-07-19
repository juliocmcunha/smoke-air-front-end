import { Link } from 'react-router-dom';
import type { GameSummary } from '@/types/game';
import { formatCentsToBRL } from '@/utils/format';
import './GameCard.css';

export function GameCard({ game }: { game: GameSummary }) {
  const isFree = game.finalPriceCents === 0;
  const hasDiscount = game.discountPercent > 0 && !isFree;

  return (
    <Link to={`/jogo/${game.slug}`} className="game-card">
      <div className="game-card__cover-wrap">
        {game.coverImageUrl && (
          <img src={game.coverImageUrl} alt={`Capa de ${game.title}`} className="game-card__cover" loading="lazy" />
        )}
        {hasDiscount && <span className="game-card__discount-flag">-{game.discountPercent}%</span>}
      </div>

      <div className="game-card__info">
        <h3 className="game-card__title">{game.title}</h3>
        {game.shortDescription && <p className="game-card__desc">{game.shortDescription}</p>}

        <div className="game-card__footer">
          <span className="game-card__rating" aria-label={`Nota ${game.averageRating.toFixed(1)} de 5`}>
            ★ {game.averageRating.toFixed(1)}
          </span>

          {isFree ? (
            <span className="price-tag price-tag--free">Grátis</span>
          ) : hasDiscount ? (
            <span className="price-tag price-tag--discount">
              <span className="price-old">{formatCentsToBRL(game.priceCents)}</span>
              {formatCentsToBRL(game.finalPriceCents)}
            </span>
          ) : (
            <span className="price-tag">{formatCentsToBRL(game.finalPriceCents)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
