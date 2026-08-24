const STEPS = [
  { title: 'Parcourir la boutique', text: "Filtrez les articles par marque, catégorie (homme, femme, enfant, autre) ou utilisez la recherche." },
  { title: "Voir un article", text: "Cliquez sur 'Plus d'infos' pour voir la description, les tailles disponibles et les avis clients." },
  { title: 'Ajouter au panier', text: "Choisissez une taille puis cliquez sur 'Ajouter au panier'. Retirez un article à tout moment." },
  { title: 'Créer un compte', text: "Avant de finaliser votre achat, vous devez créer un compte ou vous connecter." },
  { title: 'Livraison', text: 'Renseignez votre adresse de livraison et vos coordonnées.' },
  { title: 'Paiement', text: 'Choisissez votre moyen de paiement (Mobile Money, carte, ou à la livraison) puis confirmez.' },
]

export default function HelpModal({ open, onClose }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-paper rounded-2xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display text-xl font-semibold">Comment utiliser le site</h3>
          <button onClick={onClose} className="text-graphite hover:text-ink">✕</button>
        </div>
        <ol className="space-y-4">
          {STEPS.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-ink text-paper text-xs flex items-center justify-center shrink-0">{i + 1}</span>
              <div>
                <p className="font-medium text-sm">{s.title}</p>
                <p className="text-sm text-graphite">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-xs text-graphite mt-6">Besoin d'aide supplémentaire ? Contactez-nous au +229 01 00 00 00 00.</p>
      </div>
    </div>
  )
}
