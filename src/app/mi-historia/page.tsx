export const revalidate = 60;

const PARAGRAPHS = [
  'Durante años entendí el viaje como una manera de conocer nuevos lugares, pero con el tiempo descubrí que también era una forma de conocerme a mi mismo. La ruta se convirtió en mi hogar, y la van en el espacio desde donde volví a conectar con la libertad, la naturaleza y las cosas simples. Así nació Adaptive Overland: no como un proyecto perfecto o planeado, sino como una necesidad de seguir moviéndome, explorando y compartiendo otra manera de vivir la aventura. Cada kilómetro recorrido, cada frontera cruzada y cada paisaje vivido forman parte de una historia que todavía sigue escribiéndose.',
  'Viajar en silla de ruedas significa adaptarse constantemente y aprender a avanzar de maneras diferentes, pero nunca dejar de avanzar. En el camino entendí que la aventura no pertenece a un solo tipo de persona ni tiene una única forma de vivirse. Para mí, este proyecto representa movimiento, independencia y la posibilidad de descubrir el mundo a mi propio ritmo.',
  'Más que mostrar destinos, quiero transmitir una idea: que siempre existen caminos posibles para quienes siguen mirando hacia el próximo horizonte.',
];

export default function MiHistoriaPage() {
  return (
    <section className="bg-[#f0ece6] min-h-screen flex items-center px-8 lg:px-16 py-24">
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-0 items-stretch">

        {/* Texto — blanco, su altura define la fila */}
        <div className="bg-white px-8 py-12 flex flex-col justify-center">
          <h1 className="font-heading text-3xl md:text-4xl text-[#1a1714] mb-5 uppercase">
            Hola! Soy Gregoire
          </h1>
          <div className="flex flex-col gap-3">
            {PARAGRAPHS.map((p, i) => (
              <p key={i} className="text-[#2a2520] text-xs leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* Video — llena exactamente la altura de la card */}
        <div className="relative overflow-hidden" style={{ margin: '16px 0' }}>
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src="/mi-historia.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>

      </div>
    </section>
  );
}
