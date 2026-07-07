'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProduct, getCategories, updateProduct, uploadProductImage, deleteProductImage } from '@/lib/api';
import { ArrowLeft, Trash2, Upload, X } from 'lucide-react';

type PendingImage = { id: string; file: File; preview: string };

export default function EditarProductoPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
  });
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: getCategories });

  const [form, setForm] = useState({
    name: '', slug: '', description: '', price: '', stock: '',
    brand: '', sku: '', isFeatured: false, categoryId: '',
  });
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
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

  useEffect(() => () => {
    pendingImages.forEach((img) => URL.revokeObjectURL(img.preview));
  }, [pendingImages]);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const clearPendingImages = () => {
    pendingImages.forEach((img) => URL.revokeObjectURL(img.preview));
    setPendingImages([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePendingImage = (pendingId: string) => {
    setPendingImages((prev) => {
      const target = prev.find((img) => img.id === pendingId);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((img) => img.id !== pendingId);
    });
  };

  const { mutate: removeImage } = useMutation({
    mutationFn: (imageId: string) => deleteProductImage(id, imageId),
    onMutate: (imageId) => setDeletingImageId(imageId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['product', id] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      const detail = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'No se pudo eliminar la imagen.');
      setError(detail);
    },
    onSettled: () => setDeletingImageId(null),
  });

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: async () => {
      const existingCount = product!.images?.length ?? 0;
      for (let i = 0; i < pendingImages.length; i++) {
        await uploadProductImage(id, pendingImages[i].file, existingCount === 0 && i === 0);
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
      clearPendingImages();
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

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const added = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));

    setPendingImages((prev) => [...prev, ...added]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (isLoading) return <div className="p-8 flex justify-center"><div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" /></div>;
  if (!product) return <div className="p-8 text-sm text-gray-500">Producto no encontrado</div>;

  const hasImages = (product.images?.length ?? 0) > 0 || pendingImages.length > 0;

  return (
    <div className="p-8 max-w-2xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft size={14} /> Volver
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Editar producto</h1>

      <form onSubmit={(e) => { e.preventDefault(); setError(''); save(); }} className="space-y-5">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
            Imágenes del producto
          </label>

          {hasImages && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
              {product.images?.map((img) => (
                <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                  <img src={img.url} alt="" className="w-full h-full object-contain p-1" />
                  {img.isMain && (
                    <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                      Principal
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    disabled={deletingImageId === img.id}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity disabled:opacity-60"
                    aria-label="Eliminar imagen"
                  >
                    {deletingImageId === img.id ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              ))}

              {pendingImages.map((img, index) => (
                <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-amber-300 bg-gray-50">
                  <img src={img.preview} alt="" className="w-full h-full object-contain p-1" />
                  <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                    {(product.images?.length ?? 0) === 0 && index === 0 ? 'Nueva principal' : 'Nueva'}
                  </span>
                  <button
                    type="button"
                    onClick={() => removePendingImage(img.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                    aria-label="Quitar imagen pendiente"
                  >
                    <X size={14} />
                  </button>
                  <span className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] px-2 py-1 truncate">
                    {img.file.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          <label className="flex flex-col items-center justify-center w-full min-h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-amber-400 transition-colors bg-gray-50">
            <div className="flex flex-col items-center gap-2 text-gray-400 py-6">
              <Upload size={22} />
              <span className="text-xs font-medium">Agregar imágenes</span>
              <span className="text-[11px] text-gray-400">Podés seleccionar varias a la vez</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImages}
            />
          </label>

          {pendingImages.length > 0 && (
            <button
              type="button"
              onClick={clearPendingImages}
              className="mt-2 text-xs text-red-500 hover:text-red-600"
            >
              Quitar todas las imágenes nuevas ({pendingImages.length})
            </button>
          )}
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
