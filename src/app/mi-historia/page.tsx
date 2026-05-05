import { getContent } from '@/lib/api';

export const revalidate = 60;

export default async function MiHistoriaPage() {
  const content = await getContent().catch(() => []);
  const section = content.find((s) => s.key === 'my_story');

  return (
    <div className="pt-24 min-h-screen">
      {/* Hero */}
      <div className="relative h-[50vh] bg-surface flex items-center justify-center overflow-hidden">
        {section?.mediaUrl && (
          <img src={section.mediaUrl} alt="Mi Historia" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Sobre Gregoire</p>
          <h1 className="font-heading text-6xl md:text-8xl">MI HISTORIA</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-24">
        {section?.body ? (
          <div className="prose prose-invert max-w-none">
            <p className="text-text/80 text-lg leading-relaxed whitespace-pre-line">{section.body}</p>
          </div>
        ) : (
          <div className="space-y-6 text-text/80 text-lg leading-relaxed">
            <p>
              Soy Gregoire, un viajero en silla de ruedas que decidió no aceptar que la movilidad reducida fuera un límite para la aventura.
            </p>
            <p>
              Adaptive Overland nació de la necesidad de encontrar soluciones reales para viajar de forma independiente. Cada accesorio que ofrecemos fue pensado, probado y perfeccionado en ruta.
            </p>
            <p>
              Creo que la libertad de movimiento es un derecho. Y que la aventura, con las herramientas correctas, no tiene límites.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
