import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import './Navbar.css';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    navigate(search.trim() ? `/?busca=${encodeURIComponent(search.trim())}` : '/');
    setMenuOpen(false);
  }

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
    navigate('/');
  }

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand" onClick={() => setMenuOpen(false)}>
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="7" fill="var(--color-panel-raised)" />
            <path d="M8 20l3-8h10l3 8-3 3H11l-3-3z" stroke="var(--color-volt)" strokeWidth="2" />
            <circle cx="21" cy="14" r="1.4" fill="var(--color-signal)" />
            <circle cx="24" cy="17" r="1.4" fill="var(--color-signal)" />
          </svg>
          <span>Smoke Air</span>
        </Link>

        <nav className={`navbar__links ${menuOpen ? 'is-open' : ''}`}>
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>
            Loja
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/library" onClick={() => setMenuOpen(false)}>
              Biblioteca
            </NavLink>
          )}
          {isAuthenticated && user?.role === 'ADMIN' && (
            <NavLink to="/admin" onClick={() => setMenuOpen(false)}>
              Administração
            </NavLink>
          )}

          <form className="navbar__search" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              placeholder="Buscar jogos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar jogos"
            />
          </form>

          <div className="navbar__auth-mobile">
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" onClick={() => setMenuOpen(false)}>
                  Perfil
                </NavLink>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                  Sair
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                  Entrar
                </NavLink>
                <NavLink to="/register" onClick={() => setMenuOpen(false)}>
                  Criar conta
                </NavLink>
              </>
            )}
          </div>
        </nav>

        <div className="navbar__auth">
          {isAuthenticated ? (
            <Link to="/profile" className="navbar__user">
              <span className="navbar__avatar" aria-hidden="true">
                {user?.displayName?.charAt(0)?.toUpperCase() ?? '?'}
              </span>
              <span>{user?.displayName}</span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Entrar
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Criar conta
              </Link>
            </>
          )}
        </div>

        <button
          className="navbar__burger"
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
