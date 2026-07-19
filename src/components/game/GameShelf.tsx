import type { GameSummary } from '@/types/game';
import { GameCard } from './GameCard';
import './GameShelf.css';

interface GameShelfProps {
  title: string;
  subtitle?: string;
  games: GameSummary[];
}

/** Prateleira horizontal de jogos, como as vitrines de "Em alta" / "Ofertas". */
export function GameShelf({ title, subtitle, games }: GameShelfProps) {
  if (games.length === 0) return null;

  return (
    <section className="game-shelf">
      <div className="game-shelf__header">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="game-shelf__track">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
