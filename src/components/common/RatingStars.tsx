import './RatingStars.css';

interface RatingStarsProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
}

/** Exibe (e, se onChange for passado, permite escolher) uma nota de 1 a 5. */
export function RatingStars({ value, onChange, size = 16 }: RatingStarsProps) {
  const stars = [1, 2, 3, 4, 5];
  const interactive = Boolean(onChange);

  return (
    <div className={`rating-stars ${interactive ? 'is-interactive' : ''}`} role={interactive ? 'radiogroup' : undefined}>
      {stars.map((star) => {
        const filled = star <= Math.round(value);
        return interactive ? (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={filled}
            aria-label={`${star} de 5 estrelas`}
            onClick={() => onChange?.(star)}
            style={{ fontSize: size }}
          >
            {filled ? '★' : '☆'}
          </button>
        ) : (
          <span key={star} aria-hidden="true" style={{ fontSize: size }}>
            {filled ? '★' : '☆'}
          </span>
        );
      })}
    </div>
  );
}
