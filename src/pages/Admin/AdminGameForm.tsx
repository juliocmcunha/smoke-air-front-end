import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { adminService } from '@/services/adminService';
import { gameService } from '@/services/gameService';
import { extractErrorMessage } from '@/services/api';
import { Spinner } from '@/components/common/Spinner';
import type { Category } from '@/types/game';
import type { GameUpsertPayload } from '@/types/admin';

const emptyForm = {
  title: '',
  shortDescription: '',
  description: '',
  developer: '',
  publisher: '',
  releaseDate: '',
  priceReais: '0.00',
  discountPercent: 0,
  coverImageUrl: '',
  bannerImageUrl: '',
  trailerUrl: '',
  featured: false,
  active: true,
  categorySlugs: [] as string[],
  screenshotUrls: [] as string[],
};

export function AdminGameForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    gameService.listCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    adminService
      .getGame(Number(id))
      .then((game) => {
        setForm({
          title: game.title,
          shortDescription: game.shortDescription ?? '',
          description: game.description ?? '',
          developer: game.developer ?? '',
          publisher: game.publisher ?? '',
          releaseDate: game.releaseDate ?? '',
          priceReais: (game.priceCents / 100).toFixed(2),
          discountPercent: game.discountPercent,
          coverImageUrl: game.coverImageUrl ?? '',
          bannerImageUrl: game.bannerImageUrl ?? '',
          trailerUrl: game.trailerUrl ?? '',
          featured: game.featured,
          active: game.active,
          categorySlugs: game.categories.map((c) => c.slug),
          screenshotUrls: game.screenshots,
        });
      })
      .catch(() => setError('Não foi possível carregar este jogo.'))
      .finally(() => setLoading(false));
  }, [id]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleCategory(slug: string) {
    setForm((prev) => ({
      ...prev,
      categorySlugs: prev.categorySlugs.includes(slug)
        ? prev.categorySlugs.filter((s) => s !== slug)
        : [...prev.categorySlugs, slug],
    }));
  }

  function updateScreenshot(index: number, value: string) {
    setForm((prev) => ({
      ...prev,
      screenshotUrls: prev.screenshotUrls.map((url, i) => (i === index ? value : url)),
    }));
  }

  function addScreenshot() {
    setForm((prev) => ({ ...prev, screenshotUrls: [...prev.screenshotUrls, ''] }));
  }

  function removeScreenshot(index: number) {
    setForm((prev) => ({ ...prev, screenshotUrls: prev.screenshotUrls.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const priceCents = Math.round(parseFloat(form.priceReais.replace(',', '.') || '0') * 100);
    if (Number.isNaN(priceCents) || priceCents < 0) {
      setError('Informe um preço válido.');
      return;
    }

    const payload: GameUpsertPayload = {
      title: form.title,
      shortDescription: form.shortDescription,
      description: form.description,
      developer: form.developer,
      publisher: form.publisher,
      releaseDate: form.releaseDate || null,
      priceCents,
      discountPercent: form.discountPercent,
      coverImageUrl: form.coverImageUrl,
      bannerImageUrl: form.bannerImageUrl,
      trailerUrl: form.trailerUrl,
      featured: form.featured,
      active: form.active,
      categorySlugs: form.categorySlugs,
      screenshotUrls: form.screenshotUrls.filter((url) => url.trim().length > 0),
    };

    setSaving(true);
    try {
      if (isEditing) {
        await adminService.updateGame(Number(id), payload);
      } else {
        await adminService.createGame(payload);
      }
      navigate('/admin/games');
    } catch (err) {
      setError(extractErrorMessage(err, 'Não foi possível salvar o jogo.'));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner label="Carregando jogo..." />;

  return (
    <div className="admin-form-page">
      <h2 style={{ fontSize: 20, marginBottom: 20 }}>{isEditing ? 'Editar jogo' : 'Novo jogo'}</h2>

      <form className="admin-form" onSubmit={handleSubmit}>
        {error && <div className="form-error-banner">{error}</div>}

        <div className="form-grid">
          <div className="field form-grid--full">
            <label htmlFor="title">Título</label>
            <input id="title" required value={form.title} onChange={(e) => update('title', e.target.value)} />
          </div>

          <div className="field form-grid--full">
            <label htmlFor="shortDescription">Descrição curta</label>
            <input
              id="shortDescription"
              value={form.shortDescription}
              onChange={(e) => update('shortDescription', e.target.value)}
              maxLength={300}
            />
          </div>

          <div className="field form-grid--full">
            <label htmlFor="description">Descrição completa</label>
            <textarea
              id="description"
              rows={5}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="developer">Desenvolvedora</label>
            <input id="developer" value={form.developer} onChange={(e) => update('developer', e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="publisher">Distribuidora</label>
            <input id="publisher" value={form.publisher} onChange={(e) => update('publisher', e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="releaseDate">Data de lançamento</label>
            <input
              id="releaseDate"
              type="date"
              value={form.releaseDate}
              onChange={(e) => update('releaseDate', e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="price">Preço (R$)</label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              required
              value={form.priceReais}
              onChange={(e) => update('priceReais', e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="discountPercent">Desconto (%)</label>
            <input
              id="discountPercent"
              type="number"
              min={0}
              max={100}
              value={form.discountPercent}
              onChange={(e) => update('discountPercent', Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label htmlFor="coverImageUrl">URL da capa</label>
            <input
              id="coverImageUrl"
              value={form.coverImageUrl}
              onChange={(e) => update('coverImageUrl', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="field">
            <label htmlFor="bannerImageUrl">URL do banner</label>
            <input
              id="bannerImageUrl"
              value={form.bannerImageUrl}
              onChange={(e) => update('bannerImageUrl', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="field">
            <label htmlFor="trailerUrl">URL do trailer</label>
            <input
              id="trailerUrl"
              value={form.trailerUrl}
              onChange={(e) => update('trailerUrl', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="field form-grid--full">
            <label>Categorias</label>
            <div className="checkbox-grid">
              {categories.map((category) => (
                <label key={category.id} className="checkbox-chip">
                  <input
                    type="checkbox"
                    checked={form.categorySlugs.includes(category.slug)}
                    onChange={() => toggleCategory(category.slug)}
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </div>

          <div className="field form-grid--full">
            <label>Screenshots</label>
            {form.screenshotUrls.map((url, index) => (
              <div className="screenshot-row" key={index}>
                <input
                  value={url}
                  onChange={(e) => updateScreenshot(index, e.target.value)}
                  placeholder="https://..."
                />
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeScreenshot(index)}>
                  Remover
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-secondary btn-sm" onClick={addScreenshot}>
              + Adicionar screenshot
            </button>
          </div>

          <label className="checkbox-field">
            <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} />
            Exibir em destaque na home
          </label>

          <label className="checkbox-field">
            <input type="checkbox" checked={form.active} onChange={(e) => update('active', e.target.checked)} />
            Ativo (visível na loja)
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar jogo'}
          </button>
          <Link to="/admin/games" className="btn btn-ghost">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
