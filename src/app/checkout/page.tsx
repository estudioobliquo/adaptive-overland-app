'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { createOrder, initPayment, getSettings, getProducts } from '@/lib/api';
import Input from '@/components/ui/Input';

interface AddressForm {
  fullName: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  notes: string;
}

const emptyForm: AddressForm = {
  fullName: '',
  address: '',
  city: '',
  country: '',
  phone: '',
  notes: '',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total } = useCartStore();
  const syncProducts = useCartStore((s) => s.syncProducts);
  const { isAuthenticated, user } = useAuthStore();

  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: getSettings });
  const { data: freshProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
    enabled: items.length > 0,
  });
  const shippingCost = settings?.shipping_cost ? Number(settings.shipping_cost) : 0;
  const [form, setForm] = useState<AddressForm>(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Mantiene precios/stock del carrito al día con el backend.
  useEffect(() => {
    if (freshProducts) syncProducts(freshProducts);
  }, [freshProducts, syncProducts]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login?returnTo=/checkout');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/carrito');
    }
  }, [items, router]);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        fullName: f.fullName || `${user.firstName} ${user.lastName}`,
        country: f.country || 'Paraguay',
      }));
    }
  }, [user]);

  const set = (field: keyof AddressForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const order = await createOrder({
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        shippingAddress: {
          fullName: form.fullName,
          address: form.address,
          city: form.city,
          country: form.country,
          phone: form.phone,
        },
        notes: form.notes || undefined,
      });

      try {
        const { url } = await initPayment(order.id);
        window.location.href = url;
      } catch (payErr: unknown) {
        const msg = (payErr as { response?: { data?: { message?: string } } })?.response?.data?.message;
        if (typeof msg === 'string' && msg.includes('credentials not configured')) {
          // Bancard not configured — go straight to success (dev/staging mode)
          router.push(`/order/${order.id}/success`);
        } else {
          setError('Hubo un error al iniciar el pago. Tu pedido fue guardado, contactanos.');
          setLoading(false);
        }
      }
    } catch (err: unknown) {
      setError('Hubo un error al procesar tu pedido. Intentá de nuevo.');
      setLoading(false);
    }
  };

  if (!isAuthenticated() || items.length === 0) return null;

  return (
    <div className="pt-24 pb-24 px-6 min-h-screen bg-[#f0ece6]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-2">Último paso</p>
          <h1 className="font-heading text-6xl text-[#1a1714]">CHECKOUT</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#888] mb-4">Datos de contacto</p>
              <div className="space-y-4">
                <Input
                  label="Nombre completo"
                  required
                  value={form.fullName}
                  onChange={set('fullName')}
                />
                <Input
                  label="Teléfono"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={set('phone')}
                />
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-[#888] mb-4">Dirección de envío</p>
              <div className="space-y-4">
                <Input
                  label="Dirección"
                  required
                  value={form.address}
                  onChange={set('address')}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Ciudad"
                    required
                    value={form.city}
                    onChange={set('city')}
                  />
                  <Input
                    label="País"
                    required
                    value={form.country}
                    onChange={set('country')}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-[#888] block mb-1.5">
                Notas (opcional)
              </label>
              <textarea
                value={form.notes}
                onChange={set('notes')}
                rows={3}
                className="w-full bg-white border border-[#e0dcd6] hover:border-[#c0bcb8] focus:border-accent px-4 py-3 text-sm text-[#1a1714] placeholder:text-[#bbb] outline-none transition-colors resize-none"
                placeholder="Instrucciones especiales para el envío..."
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-accent hover:bg-accent-hover text-[#1a1714] text-xs uppercase tracking-widest font-semibold transition-colors disabled:opacity-60"
            >
              {loading ? 'Procesando...' : 'Ir a pagar con Bancard'}
            </button>
          </form>

          {/* Order summary */}
          <div className="bg-white p-6 h-fit border border-[#e0dcd6]">
            <p className="text-xs uppercase tracking-widest text-[#888] mb-6">Tu pedido</p>

            <div className="space-y-3 mb-6">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-[#888] truncate pr-4">
                    {product.name} × {quantity}
                  </span>
                  <span className="flex-shrink-0 text-[#1a1714]">
                    {(Number(product.price) * quantity).toLocaleString('es-PY')}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#e0dcd6] pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#888]">Subtotal</span>
                <span className="text-[#1a1714]">{total().toLocaleString('es-PY')} PYG</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#888]">Envío</span>
                <span className="text-[#1a1714]">{shippingCost === 0 ? 'Gratis' : `${shippingCost.toLocaleString('es-PY')} PYG`}</span>
              </div>
              <div className="flex justify-between font-semibold pt-1">
                <span className="text-[#1a1714]">Total</span>
                <span className="text-accent">{(total() + shippingCost).toLocaleString('es-PY')} PYG</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
