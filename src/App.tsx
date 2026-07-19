import { Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { AdminRoute } from '@/components/common/AdminRoute';
import { Home } from '@/pages/Home/Home';
import { Login } from '@/pages/Login/Login';
import { Register } from '@/pages/Register/Register';
import { ForgotPassword } from '@/pages/ForgotPassword/ForgotPassword';
import { ResetPassword } from '@/pages/ResetPassword/ResetPassword';
import { Profile } from '@/pages/Profile/Profile';
import { Library } from '@/pages/Library/Library';
import { GameDetails } from '@/pages/GameDetails/GameDetails';
import { AdminLayout } from '@/pages/Admin/AdminLayout';
import { AdminGames } from '@/pages/Admin/AdminGames';
import { AdminGameForm } from '@/pages/Admin/AdminGameForm';
import { AdminUsers } from '@/pages/Admin/AdminUsers';
import { AdminUserForm } from '@/pages/Admin/AdminUserForm';

function NotFound() {
  return (
    <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
      <h1 style={{ fontSize: 64, marginBottom: 12 }}>404</h1>
      <p>Essa página não existe.</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="jogo/:slug" element={<GameDetails />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="library"
          element={
            <ProtectedRoute>
              <Library />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminGames />} />
          <Route path="games" element={<AdminGames />} />
          <Route path="games/novo" element={<AdminGameForm />} />
          <Route path="games/:id/editar" element={<AdminGameForm />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/novo" element={<AdminUserForm />} />
          <Route path="users/:id/editar" element={<AdminUserForm />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
