export default function Footer() {
  return (
    <footer className="bg-ink text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <p className="font-display text-lg font-semibold mb-3">Chancelière Shop</p>
          <p className="text-white/60 text-sm leading-relaxed">
            Votre boutique de baskets — Homme, Femme, Enfant. Qualité, style, livraison rapide.
          </p>
        </div>
        <div>
          <p className="font-medium mb-3">Coordonnées</p>
          <ul className="text-white/60 text-sm space-y-2">
            <li>Cotonou, Littoral, Bénin</li>
            <li>+229 01 00 00 00 00</li>
            <li>contact@chanceliere-shop.com</li>
            <li>Lun – Sam : 8h – 20h</li>
          </ul>
        </div>
        <div>
          <p className="font-medium mb-3">Boutique</p>
          <ul className="text-white/60 text-sm space-y-2">
            <li>Nos marques</li>
            <li>Nouveautés</li>
            <li>Suivi de commande</li>
            <li>Aide</li>
          </ul>
        </div>
        <div>
          <p className="font-medium mb-3">Réseaux</p>
          <ul className="text-white/60 text-sm space-y-2">
            <li>Instagram</li>
            <li>Facebook</li>
            <li>WhatsApp</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-white/40 text-xs">
        © {new Date().getFullYear()} Chancelière Shop — Tous droits réservés
      </div>
    </footer>
  )
}
