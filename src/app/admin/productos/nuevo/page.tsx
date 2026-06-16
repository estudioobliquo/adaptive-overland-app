'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createProduct, uploadProductImage } from '@/lib/api';
import { ArrowLeft, Upload } from 'lucide-react';

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function NuevoProductoPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: getCategories });

  const [form, setForm] = useState({
    name: '', slug: '', description: '', price: '', stock: '',
    brand: '', sku: '', isFeatured: false, categoryId: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    if (field === 'name') setForm((f) => ({ ...f, name: e.target.value as string, slug: slugify(e.target.value as string) }));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const product = await createProduct({
        name: form.name,
        slug: form.slug,
        description: form.description || undefined,
        price: Number(form.price),
        stock: form.stock ? Number(form.stock) : undefined,
        brand: form.brand || undefined,
        sku: form.sku || undefined,
        isFeatured: form.isFeatured,
        categoryId: form.categoryId,
      });

      // El producto ya existe; si la imagen falla, no lo dejamos huérfano:
      // mandamos a la pantalla de edición para reintentar la carga.
      if (imageFile) {
        try {
          await uploadProductImage(product.id, imageFile, true);
        } catch {
          return { product, imageFailed: true };
        }
      }
      return { product, imageFailed: false };
    },
    onSuccess: ({ product, imageFailed }) => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['products'] });
      if (imageFailed) {
        router.push(`/admin/productos/${product.id}`);
      } else {
        router.push('/admin/productos');
      }
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      const detail = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al crear el producto. Verificá los datos.');
      setError(detail);
    },
  });

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="p-8 max-w-2xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft size={14} /> Volver
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Nuevo producto</h1>

      <form onSubmit={(e) => { e.preventDefault(); setError(''); mutate(); }} className="space-y-5">
        {/* Image upload */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Imagen principal</label>
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-amber-400 transition-colors overflow-hidden">
            {imagePreview ? (
              <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <Upload size={20} />
                <span className="text-xs">Subir imagen</span>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Nombre *</label>
            <input required value={form.name} onChange={set('name')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Slug *</label>
            <input required value={form.slug} onChange={set('slug')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-500 focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Precio (PYG) *</label>
            <input required type="number" min="0" value={form.price} onChange={set('price')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Stock</label>
            <input type="number" min="0" value={form.stock} onChange={set('stock')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Marca</label>
            <input value={form.brand} onChange={set('brand')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">SKU</label>
            <input value={form.sku} onChange={set('sku')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Categoría *</label>
            <select required value={form.categoryId} onChange={set('categoryId')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-white">
              <option value="">Seleccionar categoría</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Descripción</label>
            <textarea value={form.description} onChange={set('description')} rows={4} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 resize-none" />
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <input type="checkbox" id="featured" checked={form.isFeatured} onChange={set('isFeatured')} className="accent-amber-500" />
            <label htmlFor="featured" className="text-sm text-gray-700">Destacado en la tienda</label>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold text-sm rounded-lg transition-colors"
        >
          {isPending ? 'Creando...' : 'Crear producto'}
        </button>
      </form>
    </div>
  );
}
