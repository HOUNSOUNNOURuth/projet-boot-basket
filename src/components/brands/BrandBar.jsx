import { useBrands } from '../../hooks/useBrands'
import { useCategories } from '../../hooks/useCategories'

export default function BrandBar({ activeBrand, onBrandChange, activeCategory, onCategoryChange }) {
  const { brands } = useBrands()
  const { categories } = useCategories()

  return (
    <div className="max-w-7xl mx-auto px-6 mt-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-semibold">Marques</h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors capitalize ${
              !activeCategory ? 'bg-ink text-paper border-ink' : 'border-line text-graphite hover:border-ink'
            }`}
          >
            Tout
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => onCategoryChange(c.id)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors capitalize ${
                activeCategory === c.id ? 'bg-ink text-paper border-ink' : 'border-line text-graphite hover:border-ink'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        <button
          onClick={() => onBrandChange(null)}
          className={`shrink-0 px-5 py-2.5 rounded-full border text-sm font-medium transition-colors ${
            !activeBrand ? 'bg-ink text-paper border-ink' : 'border-line hover:border-ink'
          }`}
        >
          Toutes les marques
        </button>
        {brands.map((b) => (
          <button
            key={b.id}
            onClick={() => onBrandChange(b.id)}
            className={`shrink-0 px-5 py-2.5 rounded-full border text-sm font-medium transition-colors ${
              activeBrand === b.id ? 'bg-ink text-paper border-ink' : 'border-line hover:border-ink'
            }`}
          >
            {b.name}
          </button>
        ))}
      </div>
    </div>
  )
}