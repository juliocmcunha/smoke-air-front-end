import { NavLink, Outlet } from 'react-router-dom';
import './Admin.css';

export function AdminLayout() {
  return (
    <div className="admin-page container">
      <div className="admin-header">
        <div>
          <span className="eyebrow">Painel de administração</span>
          <h1>Gerenciar loja</h1>
        </div>
      </div>

      <nav className="admin-tabs">
        <NavLink to="/admin/games" className={({ isActive }) => (isActive ? 'is-active' : '')}>
          Jogos
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => (isActive ? 'is-active' : '')}>
          Usuários
        </NavLink>
      </nav>

      <Outlet />
    </div>
  );
}
