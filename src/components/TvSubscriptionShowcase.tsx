import React from 'react';
import { Check, Tv, ShieldCheck, Zap, Monitor, Smartphone, Laptop, Radio } from 'lucide-react';
import { Product } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';

interface TvShowcaseProps {
  products: Product[];
  onOpenDetail: (product: Product) => void;
}

export const TvSubscriptionShowcase: React.FC<TvShowcaseProps> = ({ products, onOpenDetail }) => {
  const { startDirectCheckout } = useCart();
  const tvProduct = products.find(p => p.id === 'hnt-tv-ultra-4k') || products.find(p => p.category === 'tv-subscriptions') || products[0];

  if (!tvProduct) return null;

  return (
    <section id="abonnements-tv" className="py-16 md:py-24 relative border-t border-white/[0.06] bg-[#07070a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs text-zinc-300 mb-3">
            <Tv className="w-3.5 h-3.5 text-amber-400" />
            <span>Spécialité HANOUT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight text-balance">
            Abonnements TV Autorisés Haute Définition 4K
          </h2>
          <p className="text-base text-zinc-400 mt-3">
            Une infrastructure de serveurs ultra-puissante garantissant une diffusion fluide, sans saccade ni temps de mise en mémoire tampon.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
          
          {/* Visual Showcase Card */}
          <div className="rounded-2xl overflow-hidden apple-glass-card border border-white/[0.1] relative p-6 sm:p-8">
            <div className="aspect-[16/10] w-full rounded-xl overflow-hidden relative mb-6">
              <img
                src={tvProduct.imageUrl}
                alt="HANOUT TV Ultra 4K"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
                <div>
                  <span className="px-2.5 py-1 rounded-md bg-white text-black font-bold text-xs">
                    Flux 60 FPS Garanti
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">
                    HANOUT TV Ultra 4K & Multi-Écrans
                  </h3>
                </div>
              </div>
            </div>

            {/* Compatible Devices Icons */}
            <div className="border-t border-white/[0.08] pt-5">
              <p className="text-xs text-zinc-400 mb-3 font-medium">Compatible avec tous vos équipements :</p>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-lg bg-zinc-900/60 border border-white/[0.05] flex flex-col items-center gap-1">
                  <Tv className="w-4 h-4 text-zinc-300" />
                  <span className="text-[10px] text-zinc-400">Smart TV</span>
                </div>
                <div className="p-2 rounded-lg bg-zinc-900/60 border border-white/[0.05] flex flex-col items-center gap-1">
                  <Monitor className="w-4 h-4 text-zinc-300" />
                  <span className="text-[10px] text-zinc-400">Apple / Box</span>
                </div>
                <div className="p-2 rounded-lg bg-zinc-900/60 border border-white/[0.05] flex flex-col items-center gap-1">
                  <Laptop className="w-4 h-4 text-zinc-300" />
                  <span className="text-[10px] text-zinc-400">PC & Mac</span>
                </div>
                <div className="p-2 rounded-lg bg-zinc-900/60 border border-white/[0.05] flex flex-col items-center gap-1">
                  <Smartphone className="w-4 h-4 text-zinc-300" />
                  <span className="text-[10px] text-zinc-400">iOS & Android</span>
                </div>
              </div>
            </div>
          </div>

          {/* Value proposition & Specs */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/[0.06] flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-white">
                  <Radio className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">18 000+ Chaînes Internationales</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Bouquets sportifs en direct, documentaires, divertissement et chaînes généralistes en qualité UHD, FHD et HEVC.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/[0.06] flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-white">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Technologie Anti-Freeze 2026</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Équilibrage dynamique de charge (Load Balancing) sur grappe de serveurs européens 10 Gbps pour éliminer tout lag durant les grands matchs.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/[0.06] flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-white">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Distribution Autorisée & Service Sécurisé</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Respect des protocoles et normes légales, serveurs cryptés et service client réactif disponible 7j/7 pour vous assister.
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing card action */}
            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-white/[0.1] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-zinc-400">Formules officielles · 12 ou 24 Mois</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    89.99 €
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">/ 12 mois</span>
                  <span className="text-xs text-zinc-500">·</span>
                  <span className="text-xs text-amber-400 font-bold">149.99 € / 24 mois</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">Activation immédiate en 60 secondes chrono</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onOpenDetail(tvProduct)}
                  className="w-1/3 sm:w-auto px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors"
                >
                  Détails
                </button>
                <button
                  onClick={() => startDirectCheckout(tvProduct, 12)}
                  className="w-1/3 sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-bold transition-all"
                >
                  12 Mois (89.99 €)
                </button>
                <button
                  onClick={() => startDirectCheckout(tvProduct, 24)}
                  className="w-1/3 sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all shadow-lg active:scale-95"
                >
                  24 Mois (149.99 €)
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
