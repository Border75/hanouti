import React from 'react';
import { Tv, ShieldCheck, Cloud, KeyRound, ArrowRight, Zap, CheckCircle2, Star } from 'lucide-react';
import { Product } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';

interface BentoGridSectionProps {
  products: Product[];
  onOpenDetail: (product: Product) => void;
}

export const BentoGridSection: React.FC<BentoGridSectionProps> = ({ products, onOpenDetail }) => {
  const { startDirectCheckout } = useCart();

  const tvProduct = products.find(p => p.id === 'hnt-tv-ultra-4k') || products[0];
  const vpnProduct = products.find(p => p.id === 'hnt-aegis-vpn') || products[1];
  const cloudProduct = products.find(p => p.id === 'hnt-nebos-cloud') || products[2];
  const licenseProduct = products.find(p => p.id === 'hnt-windows-pro-2026') || products[3];

  return (
    <section className="py-20 md:py-28 relative border-t border-white/[0.08] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] glow-blue pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] glow-cyan pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>Architecture Bento · Écosystème HANOUT</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight text-balance">
              Quatre univers. Une seule exigence de qualité.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3 max-w-2xl">
              Chaque service est propulsé par des infrastructures serveur privées, assurant une disponibilité absolue et une délivrance automatisée.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Serveurs CDN opérationnels · Latence &lt; 15ms</span>
          </div>
        </div>

        {/* Asymmetric Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {/* Bento Item 1: Large TV Hero Card (Spans 2 cols, 2 rows) */}
          {tvProduct && (
            <div className="md:col-span-2 lg:col-span-2 lg:row-span-2 rounded-3xl titanium-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="px-3 py-1 rounded-lg bg-white/10 text-white text-xs font-bold border border-white/15 backdrop-blur-md flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Abonnements TV 4K Ultra</span>
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">12M ou 24M</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                  {tvProduct.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed mb-6">
                  {tvProduct.tagline} Plus de 18 000 chaînes directes mondiales et 80 000 VOD en qualité 4K UHD avec technologie anti-freeze.
                </p>

                {/* Micro specs */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-white/[0.06]">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Résolution max</span>
                    <span className="text-xs font-bold text-white font-mono">4K UHD @ 60 FPS</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-white/[0.06]">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Replay inclus</span>
                    <span className="text-xs font-bold text-white font-mono">Catch-Up 7 Jours</span>
                  </div>
                </div>
              </div>

              {/* Media preview */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-6 border border-white/10 shadow-2xl">
                <img
                  src={tvProduct.imageUrl}
                  alt={tvProduct.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <span className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono">
                    Xtream Codes & M3U
                  </span>
                  <span className="bg-emerald-500/80 text-black font-extrabold px-2.5 py-0.5 rounded-md text-[11px]">
                    4K ACTIF
                  </span>
                </div>
              </div>

              {/* Bottom Price & CTAs */}
              <div className="relative z-10 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 block">À partir de</span>
                  <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
                    {tvProduct.pricing?.[12]?.toFixed(2)} € <span className="text-xs text-slate-400 font-normal">/ an</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenDetail(tvProduct)}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                  >
                    Détails
                  </button>
                  <button
                    onClick={() => startDirectCheckout(tvProduct, 24)}
                    className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-slate-200 transition-all shadow-lg active:scale-95 flex items-center gap-1"
                  >
                    <span>24 Mois ({tvProduct.pricing?.[24]?.toFixed(2)} €)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bento Item 2: VPN Security Card */}
          {vpnProduct && (
            <div className="md:col-span-1 lg:col-span-2 rounded-3xl titanium-card p-6 sm:p-7 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-lg bg-white/10 text-white text-xs font-bold border border-white/15 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cyber Sécurité No-Logs</span>
                  </span>
                  <span className="text-xs font-mono text-cyan-400 font-semibold">10 Gbps</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{vpnProduct.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {vpnProduct.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-300 mb-6">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>92 Pays</span>
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>10 Appareils</span>
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">12 Mois dès</span>
                  <div className="text-lg font-bold text-white font-mono">
                    {vpnProduct.pricing?.[12]?.toFixed(2)} €
                  </div>
                </div>
                <button
                  onClick={() => startDirectCheckout(vpnProduct, 12)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black text-xs font-bold transition-all"
                >
                  Commander
                </button>
              </div>
            </div>
          )}

          {/* Bento Item 3: Cloud Storage Card */}
          {cloudProduct && (
            <div className="md:col-span-1 lg:col-span-1 rounded-3xl titanium-card p-6 flex flex-col justify-between group">
              <div>
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                  <Cloud className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5">{cloudProduct.name}</h3>
                <p className="text-xs text-slate-400 mb-4 line-clamp-3">
                  Chiffrement zéro-connaissance en Suisse avec 2 000 Go de sauvegarde haute vitesse.
                </p>
                <div className="text-xs font-mono text-cyan-300 font-bold mb-4">
                  2 000 Go Dédiés
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-sm font-bold text-white font-mono">
                  {cloudProduct.pricing?.[12]?.toFixed(2)} € / an
                </span>
                <button
                  onClick={() => onOpenDetail(cloudProduct)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Bento Item 4: Digital Licenses Card */}
          {licenseProduct && (
            <div className="md:col-span-1 lg:col-span-1 rounded-3xl titanium-card p-6 flex flex-col justify-between group">
              <div>
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5">{licenseProduct.name}</h3>
                <p className="text-xs text-slate-400 mb-4 line-clamp-3">
                  Clé authentique OEM 25 caractères certifiée avec support technique 12 ou 24 mois.
                </p>
                <div className="text-xs font-mono text-emerald-400 font-bold mb-4">
                  Activation Immédiate
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-sm font-bold text-white font-mono">
                  {licenseProduct.pricing?.[12]?.toFixed(2)} €
                </span>
                <button
                  onClick={() => onOpenDetail(licenseProduct)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
