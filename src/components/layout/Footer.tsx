import { Link } from 'react-router-dom';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <p className="footer__brand">Smoke Air</p>
          <p className="footer__tagline">Projeto de portfólio — loja e biblioteca de jogos.</p>
        </div>
        <nav className="footer__links">
          <Link to="/">Loja</Link>
          <Link to="/library">Biblioteca</Link>
          <Link to="/login">Entrar</Link>
          <Link to="/register">Criar conta</Link>
        </nav>
      </div>
    </footer>
  );
}
