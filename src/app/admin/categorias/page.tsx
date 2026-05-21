'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory, updateCategory } from '@/lib/api';
import type { Category } from '@/lib/types';
import { Plus, Pencil, X, Check } from 'lucide-react';

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const emptyForm = { name: '', slug: '', description: '', imageUrl: '' };

export default function AdminCategoriasPage() {
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    retry: false,
  });

  const { mutate: create, isPending: creating } = useMutation({
    mutationFn: () => createCategory({ name: form.name, slug: form.slug, description: form.description || undefined, imageUrl: form.imageUrl || undefined }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); setShowCreate(false); setForm(emptyForm); },
    onError: () => setError('Error al crear la categoría.'),
  });

  const { mutate: update, isPending: updating } = useMutation({
    mutationFn: () => updateCategory(editId!, { name: form.name, slug: form.slug, description: form.description || undefined, imageUrl: form.imageUrl || undefined }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); setEditId(null); setForm(emptyForm); },
    onError: () => setError('Error al actualizar la categoría.'),
  });

  const startEdit = (cat: Category) => {
    setEditId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description ?? '', imageUrl: cat.imageUrl ?? '' });
    setShowCreate(false);
    setError('');
  };

  const cancel = () => { setEditId(null); setShowCreate(false); setForm(emptyForm); setError(''); };

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (field === 'name') setForm((f) => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
        <button
          onClick={() => { setShowCreate(true); setEditId(null); setForm(emptyForm); setError(''); }}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={14} />
          Nueva categoría
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Create form */}
        {showCreate && (
          <div className="px-6 py-5 border-b border-gray-100 bg-amber-50">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-4">Nueva categoría</p>
            <CategoryForm form={form} set={set} error={error} onSubmit={() => { setError(''); create(); }} onCancel={cancel} loading={creating} label="Crear" />
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <p className="text-center py-16 text-sm text-gray-400">No hay categorías</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <>
                  <tr key={cat.id} className={`hover:bg-gray-50 ${editId === cat.id ? 'bg-amber-50' : ''}`}>
                    <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{cat.slug}</td>
                    <td className="px-6 py-4 text-gray-500 truncate max-w-xs">{cat.description ?? '—'}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => editId === cat.id ? cancel() : startEdit(cat)} className="p-1.5 text-gray-400 hover:text-amber-600 rounded transition-colors">
                        {editId === cat.id ? <X size={14} /> : <Pencil size={14} />}
                      </button>
                    </td>
                  </tr>
                  {editId === cat.id && (
                    <tr key={`${cat.id}-edit`}>
                      <td colSpan={4} className="px-6 py-5 bg-amber-50 border-b border-amber-100">
                        <CategoryForm form={form} set={set} error={error} onSubmit={() => { setError(''); update(); }} onCancel={cancel} loading={updating} label="Guardar" />
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function CategoryForm({ form, set, error, onSubmit, onCancel, loading, label }: {
  form: { name: string; slug: string; description: string; imageUrl: string };
  set: (field: 'name' | 'slug' | 'description' | 'imageUrl') => (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
  onSubmit: () => void;
  onCancel: () => void;
  loading: boolean;
  label: string;
}) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="grid grid-cols-4 gap-3 items-end">
      <div>
        <label className="text-xs font-medium text-gray-500 block mb-1">Nombre *</label>
        <input required value={form.name} onChange={set('name')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 bg-white" />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-500 block mb-1">Slug *</label>
        <input required value={form.slug} onChange={set('slug')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-400 bg-white" />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-500 block mb-1">Descripción</label>
        <input value={form.description} onChange={set('description')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 bg-white" />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
          <Check size={13} /> {label}
        </button>
        <button type="button" onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg transition-colors bg-white">
          <X size={13} />
        </button>
      </div>
      {error && <p className="col-span-4 text-red-500 text-xs mt-1">{error}</p>}
    </form>
  );
}
