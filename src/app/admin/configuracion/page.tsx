'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Check } from 'lucide-react';
import { getSettings, updateSettings } from '@/lib/api';

export default function AdminConfiguracionPage() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({ queryKey: ['settings'], queryFn: getSettings });

  const [shippingCost, setShippingCost] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings?.shipping_cost !== undefined) {
      setShippingCost(settings.shipping_cost);
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: () => updateSettings({ shipping_cost: shippingCost }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-sm text-gray-500 mt-1">Ajustes generales de la tienda</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-400">Cargando...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-5">Envío</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Costo de envío (PYG)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(e.target.value)}
                    className="w-48 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="0"
                  />
                  <span className="text-sm text-gray-400">
                    {shippingCost === '0' || shippingCost === '' ? 'Envío gratis' : `${Number(shippingCost).toLocaleString('es-PY')} PYG`}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Ingresá 0 para mostrar "Gratis" a los clientes.</p>
              </div>
            </div>
          </section>

          {mutation.isError && (
            <p className="text-sm text-red-500">Error al guardar. Intentá de nuevo.</p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-60"
          >
            {saved ? (
              <>
                <Check size={15} />
                Guardado
              </>
            ) : (
              <>
                <Save size={15} />
                {mutation.isPending ? 'Guardando...' : 'Guardar cambios'}
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
