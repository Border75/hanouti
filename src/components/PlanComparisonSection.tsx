import React from 'react';
import { Check, Zap, Sparkles, ShieldCheck, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Product } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';

interface PlanComparisonProps {
  products: Product[];
}

export const PlanComparisonSection: React.FC<PlanComparisonProps> = ({ products }) => {
  const { startDirectCheckout } = useCart();
  const tvProduct = products.find(p => p.id === 'hnt-tv-ultra-4k') || products[0];

  if (!tvProduct) return null;

  const price12 = tvProduct.pricing?.[12] || 89.99;
  const price24 = tvProduct.pricing?.[24] || 149.99;

  return (
    <section className="py-20 md:py-28 relative border-t border-white/[0.08] bg-[#05070d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Comparatif Officiel</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight text-balance">
            Choisissez la durée idéale pour votre divertissement
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3">
            Deux formules complètes sans engagement de reconduction tacite, avec garantie d'assistance technique continue.
          </p>
        </div>

        {/* 2-Column Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* Card 1: 12 Mois (1 An) */}
          <div className="rounded-3xl titanium-card p-8 flex flex-col justify-between border border-white/10 relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Formule Annuelle
                </span>
                <span className="text-xs px-2.5 py-1 rounded-md bg-white/10 text-slate-300 font-mono">
                  12 Mois
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Abonnement 1 An</h3>
              <p className="text-xs text-slate-400 mb-6">
                Idéal pour tester l'excellence de nos flux 4K UHD avec un an de tranquillité garantie.
              </p>

              {/* Price Block */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/[0.06] mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                    {price12.toFixed(2)} €
                  </span>
                  <span className="text-xs text-slate-400">TTC</span>
                </div>
                <div className="text-xs text-cyan-400 font-mono mt-1">
                  soit {(price12 / 12).toFixed(2)} € / mois
                </div>
              </div>

              {/* Checklist */}
              <ul className="space-y-3 mb-8 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>18 000+ Chaînes 4K UHD, FHD & HEVC directes</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>80 000+ Films & Séries VOD mis à jour</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Replay 7 jours (Catch-Up TV) & EPG complet</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Compatible Smart TV, Apple TV, Firestick, Android, PC</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Livraison automatisée par e-mail en 60 secondes</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => startDirectCheckout(tvProduct, 12)}
              className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Choisir la formule 12 Mois</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: 24 Mois (2 Ans) [FEATURED LUXURY HIGHLIGHT] */}
          <div className="rounded-3xl titanium-card p-8 flex flex-col justify-between border-2 border-cyan-400/50 relative shadow-2xl bg-gradient-to-b from-[#10192e] to-[#090d18]">
            
            {/* Top Floating Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-xs font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              <span>Meilleure Offre · Économisez 58%</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 mt-2">
                <span className="text-xs uppercase font-bold tracking-wider text-cyan-400">
                  Pack Suprême Sérénité
                </span>
                <span className="text-xs px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 font-mono font-bold border border-cyan-500/30">
                  24 Mois (2 Ans)
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Abonnement 2 Ans</h3>
              <p className="text-xs text-slate-300 mb-6">
                Le choix privilégié de nos clients : zéro réabonnement pendant 2 ans et priorité sur les serveurs CDN européens.
              </p>

              {/* Price Block */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                    {price24.toFixed(2)} €
                  </span>
                  <span className="text-xs text-slate-400 line-through font-mono">{(price12 * 2).toFixed(2)} €</span>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                    -30 € Direct
                  </span>
                </div>
                <div className="text-xs text-cyan-300 font-mono font-bold mt-1">
                  soit seulement {(price24 / 24).toFixed(2)} € / mois
                </div>
              </div>

              {/* Checklist */}
              <ul className="space-y-3 mb-8 text-xs text-slate-200">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="font-semibold text-white">Tout ce qui est inclus dans le pack 12 mois</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="font-semibold text-white">Accès aux serveurs CDN VIP Ultra-Faible Latence</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Support client prioritaire dédié par WhatsApp 24/7</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Remplacement garanti immédiat sans frais en cas de panne</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Code d’accès activable à tout moment (aucun délai obligatoire)</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => startDirectCheckout(tvProduct, 24)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>Prendre le Pack 24 Mois ({price24.toFixed(2)} €)</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
