import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { gameService } from '@/services/gameService';
import { orderService } from '@/services/orderService';
import { wishlistService } from '@/services/wishlistService';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/common/Spinner';
import { RatingStars } from '@/components/common/RatingStars';
import { extractErrorMessage } from '@/services/api';
import { formatCentsToBRL, formatDate } from '@/utils/format';
import type { GameDetail, Review } from '@/types/game';
import './GameDetails.css';

export function GameDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [game, setGame] = useState<GameDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [buying, setBuying] = useState(false);
  const [buyMessage, setBuyMessage] = useState<string | null>(null);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [wishlisting, setWishlisting] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    gameService
      .getBySlug(slug)
      .then((data) => {
        setGame(data);
        return gameService.listReviews(data.id);
      })
      .then(setReviews)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleBuy() {
    if (!game) return;
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    setBuying(true);
    setBuyError(null);
    setBuyMessage(null);
    try {
      await orderService.checkout([game.id]);
      setBuyMessage('Compra concluída! O jogo já está na sua biblioteca.');
      setGame({ ...game, ownedByCurrentUser: true });
    } catch (err) {
      setBuyError(extractErrorMessage(err, 'Não foi possível concluir a compra.'));
    } finally {
      setBuying(false);
    }
  }

  async function handleWishlist() {
    if (!game) return;
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    setWishlisting(true);
    try {
      await wishlistService.add(game.id);
      setBuyMessage('Adicionado à sua lista de desejos.');
    } catch (err) {
      setBuyError(extractErrorMessage(err, 'Não foi possível adicionar à lista de desejos.'));
    } finally {
      setWishlisting(false);
    }
  }

  async function handleReviewSubmit() {
    if (!game) return;
    setSubmittingReview(true);
    setReviewError(null);
    try {
      const created = await gameService.createReview(game.id, reviewRating, reviewComment);
      setReviews((prev) => [created, ...prev]);
      setReviewComment('');
    } catch (err) {
      setReviewError(extractErrorMessage(err, 'Não foi possível enviar sua avaliação.'));
    } finally {
      setSubmittingReview(false);
    }
  }

  if (loading) return <Spinner label="Carregando jogo..." />;

  if (notFound || !game) {
    return (
      <div className="container">
        <div className="empty-state" style={{ marginTop: 48 }}>
          <h3>Jogo não encontrado</h3>
          <p>O link pode estar quebrado, ou o jogo foi removido do catálogo.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  const isFree = game.finalPriceCents === 0;
  const hasDiscount = game.discountPercent > 0 && !isFree;

  return (
    <div className="game-details">
      <div className="game-details__banner" style={{ backgroundImage: `url(${game.bannerImageUrl ?? game.coverImageUrl ?? ''})` }}>
        <div className="game-details__scrim" />
      </div>

      <div className="container game-details__content">
        <div className="game-details__main">
          <div className="game-details__categories">
            {game.categories.map((c) => (
              <span key={c.id} className="badge badge--volt">
                {c.name}
              </span>
            ))}
          </div>

          <h1>{game.title}</h1>

          <div className="game-details__meta">
            <span>★ {game.averageRating.toFixed(1)}</span>
            {game.developer && <span>{game.developer}</span>}
            {game.releaseDate && <span>{formatDate(game.releaseDate)}</span>}
          </div>

          {game.description && <p className="game-details__description">{game.description}</p>}

          {game.screenshots.length > 0 && (
            <div className="game-details__screenshots">
              {game.screenshots.map((url) => (
                <img key={url} src={url} alt={`Captura de tela de ${game.title}`} loading="lazy" />
              ))}
            </div>
          )}

          <section className="reviews">
            <h2>Avaliações da comunidade</h2>

            {isAuthenticated && game.ownedByCurrentUser && (
              <div className="ticket-card review-form">
                <div className="ticket-card__body">
                  {reviewError && <div className="form-error-banner">{reviewError}</div>}
                  <RatingStars value={reviewRating} onChange={setReviewRating} size={22} />
                  <textarea
                    rows={3}
                    placeholder="O que você achou desse jogo?"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    maxLength={1000}
                  />
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleReviewSubmit}
                    disabled={submittingReview}
                  >
                    {submittingReview ? 'Enviando...' : 'Publicar avaliação'}
                  </button>
                </div>
              </div>
            )}

            {isAuthenticated && !game.ownedByCurrentUser && (
              <p className="reviews__hint">Compre este jogo para deixar sua avaliação.</p>
            )}

            {reviews.length === 0 ? (
              <p className="reviews__hint">Ainda não há avaliações para este jogo.</p>
            ) : (
              <ul className="reviews__list">
                {reviews.map((review) => (
                  <li key={review.id} className="review-item">
                    <div className="review-item__header">
                      <span className="review-item__user">{review.username}</span>
                      <RatingStars value={review.rating} />
                    </div>
                    {review.comment && <p>{review.comment}</p>}
                    <span className="review-item__date">{formatDate(review.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="ticket-card buy-panel">
          <div className="ticket-card__body">
            {buyMessage && <div className="form-success-banner">{buyMessage}</div>}
            {buyError && <div className="form-error-banner">{buyError}</div>}

            <div className="buy-panel__price">
              {isFree ? (
                <span className="price-tag price-tag--free">Grátis</span>
              ) : hasDiscount ? (
                <>
                  <span className="badge">-{game.discountPercent}%</span>
                  <span className="price-old">{formatCentsToBRL(game.priceCents)}</span>
                  <strong>{formatCentsToBRL(game.finalPriceCents)}</strong>
                </>
              ) : (
                <strong>{formatCentsToBRL(game.finalPriceCents)}</strong>
              )}
            </div>

            {game.ownedByCurrentUser ? (
              <span className="badge badge--gold buy-panel__owned">✓ Na sua biblioteca</span>
            ) : (
              <button className="btn btn-primary btn-block" onClick={handleBuy} disabled={buying}>
                {buying ? 'Processando...' : 'Comprar agora'}
              </button>
            )}

            {!game.ownedByCurrentUser && (
              <button className="btn btn-ghost btn-block" onClick={handleWishlist} disabled={wishlisting}>
                {wishlisting ? 'Adicionando...' : '+ Lista de desejos'}
              </button>
            )}

            {game.publisher && (
              <div className="buy-panel__info">
                <span>Distribuidora</span>
                <strong>{game.publisher}</strong>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
