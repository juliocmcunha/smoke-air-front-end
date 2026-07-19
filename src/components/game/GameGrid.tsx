import type { GameSummary } from '@/types/game';
import { GameCard } from './GameCard';
import './GameGrid.css';

/** Grade responsiva de jogos, usada na página de busca/catálogo completo. */
export function GameGrid({ games }: { games: GameSummary[] }) {
  return (
    <div className="game-grid">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
