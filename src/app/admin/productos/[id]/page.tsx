'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProduct, getCategories, updateProduct, uploadProductImage } from '@/lib/api';
import { ArrowLeft, Plus } from 'lucide-react';

export default function EditarProductoPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const qc = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
  });
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: getCategories });

  const [form, setForm] = useState({
    name: '', slug: '', description: '', price: '', stock: '',
    brand: '', sku: '', isFeatured: false, categoryId: '',
  });
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchParams.get('imageError') === '1') {
      setError('El producto se guardó, pero la imagen no se pudo subir. Reintentá agregar la imagen.');
    }
  }, [searchParams]);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        slug: product.slug,
        description: product.description ?? '',
        price: String(product.price),
        stock: String(product.stock),
        brand: (product as unknown as { brand?: string }).brand ?? '',
        sku: (product as unknown as { sku?: string }).sku ?? '',
        isFeatured: product.isFeatured,
        categoryId: product.category?.id ?? '',
      });
    }
  }, [product]);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: async () => {
      if (newImageFile) {
        await uploadProductImage(id, newImageFile, product.images?.length === 0);
      }
      await updateProduct(id, {
        name: form.name,
        slug: form.slug,
        description: form.description || undefined,
        price: Number(form.price),
        stock: Number(form.stock),
        brand: form.brand || undefined,
        sku: form.sku || undefined,
        isFeatured: form.isFeatured,
        ...(form.categoryId ? { categoryId: form.categoryId } : {}),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['product', id] });
      router.push('/admin/productos');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      const detail = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al guardar los cambios.');
      setError(detail);
    },
  });

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImageFile(file);
    setNewImagePreview(URL.createObjectURL(file));
  };

  if (isLoading) return <div className="p-8 flex justify-center"><div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" /></div>;
  if (!product) return <div className="p-8 text-sm text-gray-500">Producto no encontrado</div>;

  return (
    <div className="p-8 max-w-2xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft size={14} /> Volver
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Editar producto</h1>

      <form onSubmit={(e) => { e.preventDefault(); setError(''); save(); }} className="space-y-5">
        {/* Existing images */}
        {product.images?.length > 0 && (
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Imágenes actuales</label>
            <div className="flex gap-2 flex-wrap">
              {product.images.map((img) => (
                <div key={img.id} className="relative">
                  <img src={img.url} alt="" className="w-20 h-20 rounded-lg object-cover border border-gray-200" />
                  {img.isMain && <span className="absolute top-1 left-1 bg-amber-500 text-white text-[10px] px-1 rounded">Principal</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add image */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Agregar imagen</label>
          <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-amber-400 transition-colors overflow-hidden">
            {newImagePreview ? (
              <img src={newImagePreview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center gap-2 text-gray-400">
                <Plus size={16} />
                <span className="text-xs">Agregar imagen</span>
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
          disabled={saving}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold text-sm rounded-lg transition-colors"
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
