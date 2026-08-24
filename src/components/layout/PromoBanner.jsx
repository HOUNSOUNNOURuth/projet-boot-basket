import { useState, useEffect } from 'react'

const SLIDES = [
  {
    title: 'La paire qui change tout',
    subtitle: 'Nouvelle collection — livraison rapide partout en ville.',
    cta: 'Voir la collection',
  },
  {
    title: '-20% sur une sélection',
    subtitle: 'Offre limitée sur les modèles running et lifestyle.',
    cta: "Profiter de l'offre",
  },
  {
    title: 'Édition Homme / Femme / Enfant',
    subtitle: 'Toutes les tailles, toutes les marques, un seul endroit.',
    cta: 'Découvrir',
  },
]

export default function PromoBanner() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  const slide = SLIDES[index]

  return (
    <div className="max-w-7xl mx-auto px-6 mt-6">
      <div className="relative bg-ink text-paper rounded-xl2 overflow-hidden px-8 md:px-14 py-14 md:py-20 flex items-center justify-between">
        <div className="max-w-lg">
          <p className="uppercase tracking-widest text-xs text-graphite mb-4">Chancelière Shop</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-4">
            {slide.title}
          </h1>
          <p className="text-white/70 mb-8">{slide.subtitle}</p>
          <button className="bg-paper text-ink px-6 py-3 rounded-full font-medium hover:bg-white/90 transition-colors">
            {slide.cta}
          </button>
        </div>

        <div className="hidden md:flex items-center justify-center w-64 h-64 rounded-full border border-white/20">
          <svg width="140" height="140" viewBox="0 0 24 24" fill="none">
            <path d="M2 18h20l-2-6H4l-2 6Z" stroke="white" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M4 12l2-5c.4-1 1.3-1.5 2.3-1.2l9 2.7c1 .3 1.5 1.3 1.2 2.3L18 12" stroke="white" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="absolute bottom-5 left-8 md:left-14 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-paper' : 'w-1.5 bg-white/30'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
