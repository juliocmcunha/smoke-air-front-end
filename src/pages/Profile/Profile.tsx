import { useState, type FormEvent } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/userService';
import { extractErrorMessage } from '@/services/api';
import { formatDate } from '@/utils/format';
import './Profile.css';

export function Profile() {
  const { user, setUser } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  if (!user) return null;

  async function handleProfileSubmit(event: FormEvent) {
    event.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);
    setProfileError(null);
    try {
      const updated = await userService.updateProfile({ displayName, bio, avatarUrl });
      setUser(updated);
      setProfileMessage('Perfil atualizado com sucesso.');
    } catch (err) {
      setProfileError(extractErrorMessage(err, 'Não foi possível salvar seu perfil.'));
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent) {
    event.preventDefault();
    setSavingPassword(true);
    setPasswordMessage(null);
    setPasswordError(null);
    try {
      await userService.changePassword(currentPassword, newPassword);
      setPasswordMessage('Senha alterada com sucesso.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordError(extractErrorMessage(err, 'Não foi possível trocar sua senha.'));
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="profile-page container">
      <section className="profile-header ticket-card">
        <div className="profile-header__avatar">
          {avatarUrl ? <img src={avatarUrl} alt={displayName} /> : <span>{displayName.charAt(0).toUpperCase()}</span>}
        </div>
        <div>
          <h1>{user.displayName}</h1>
          <p className="profile-header__handle">@{user.username}</p>
          <p className="profile-header__since">Na loja desde {formatDate(user.memberSince)}</p>
        </div>
      </section>

      <div className="profile-grid">
        <section className="ticket-card profile-panel">
          <div className="ticket-card__stub profile-panel__stub">
            <h2>Editar perfil</h2>
            <p>Essas informações aparecem para outros jogadores em avaliações.</p>
          </div>
          <div className="ticket-divider" />
          <div className="ticket-card__body">
            <form className="auth-form" onSubmit={handleProfileSubmit}>
              {profileError && <div className="form-error-banner">{profileError}</div>}
              {profileMessage && <div className="form-success-banner">{profileMessage}</div>}

              <div className="field">
                <label htmlFor="displayName">Nome de exibição</label>
                <input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>

              <div className="field">
                <label htmlFor="avatarUrl">URL do avatar</label>
                <input
                  id="avatarUrl"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="field">
                <label htmlFor="bio">Bio</label>
                <textarea id="bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} maxLength={500} />
              </div>

              <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                {savingProfile ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </form>
          </div>
        </section>

        <section className="ticket-card profile-panel">
          <div className="ticket-card__stub profile-panel__stub">
            <h2>Alterar senha</h2>
            <p>Recomendamos uma senha exclusiva para esta conta.</p>
          </div>
          <div className="ticket-divider" />
          <div className="ticket-card__body">
            <form className="auth-form" onSubmit={handlePasswordSubmit}>
              {passwordError && <div className="form-error-banner">{passwordError}</div>}
              {passwordMessage && <div className="form-success-banner">{passwordMessage}</div>}

              <div className="field">
                <label htmlFor="currentPassword">Senha atual</label>
                <input
                  id="currentPassword"
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="newPassword">Nova senha</label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-secondary" disabled={savingPassword}>
                {savingPassword ? 'Salvando...' : 'Alterar senha'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
