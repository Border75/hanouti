import React, { useState } from 'react';
import { ArrowRight, Zap, ShieldCheck, CheckCircle2, Tv, Play, Radio, Sparkles } from 'lucide-react';
import { DurationOption, Product } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';

interface HeroProps {
  products: Product[];
  onExplore: () => void;
  onExploreTV: () => void;
}

export const Hero: React.FC<HeroProps> = ({ products, onExplore, onExploreTV }) => {
  const { startDirectCheckout } = useCart();
  const [heroDuration, setHeroDuration] = useState<DurationOption>(24);

  const tvProduct = products.find(p => p.id === 'hnt-tv-ultra-4k') || products[0];
  const price = tvProduct?.pricing?.[heroDuration] ?? (heroDuration === 24 ? 149.99 : 89.99);

  return (
    <section className="relative overflow-hidden pt-8 pb-20 md:pt-14 md:pb-28">
      {/* Dynamic ambient background glows */}
      <div className="absolute -top-32 left-1/3 w-[650px] h-[650px] glow-blue pointer-events-none" />
      <div className="absolute top-1/4 right-5 w-[450px] h-[450px] glow-cyan pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Split 2-Column Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand Message & Interactive Plan Selector (Col 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Kicker Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>HANOUT · Boutique Digitale Haute Définition</span>
              <span className="text-slate-600">|</span>
              <span className="text-white font-bold">12 ou 24 Mois</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.08] text-balance">
              Le digital, <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">autrement.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Services TV autorisés à la revente en flux 4K UHD, sécurité VPN certifiée et licences logicielles officielles. Activation automatisée en 60 secondes chrono.
            </p>

            {/* Interactive Hero Plan Selector Card */}
            <div className="p-5 rounded-2xl titanium-card border border-white/10 space-y-4 max-w-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Sélectionnez votre formule TV :</span>
                {heroDuration === 24 ? (
                  <span className="text-cyan-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Meilleure économie (-58%)</span>
                  </span>
                ) : (
                  <span className="text-slate-400">1 An de sérénité</span>
                )}
              </div>

              {/* Segmented Duration Switch */}
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-900/90 rounded-xl border border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setHeroDuration(12)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    heroDuration === 12
                      ? 'bg-white text-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  12 Mois (89.99 €)
                </button>

                <button
                  type="button"
                  onClick={() => setHeroDuration(24)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all relative ${
                    heroDuration === 24
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>24 Mois (149.99 €)</span>
                  <span className="absolute -top-2 -right-1 text-[9px] bg-emerald-400 text-black px-1.5 py-0.2 rounded font-extrabold">
                    POPULAIRE
                  </span>
                </button>
              </div>

              {/* Price and CTA row */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-[11px] text-slate-400 block">Total pour {heroDuration} Mois :</span>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    {price.toFixed(2)} € <span className="text-xs font-normal text-slate-400">TTC</span>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    soit {(price / heroDuration).toFixed(2)} € / mois
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (tvProduct) startDirectCheckout(tvProduct, heroDuration);
                  }}
                  className="px-5 py-3 rounded-xl bg-white hover:bg-slate-200 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl active:scale-95 flex items-center gap-1.5"
                >
                  <span>Commander ({price.toFixed(2)} €)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Trust guarantees bar */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Paiement Chiffré Stripe</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Livraison en 60s par e-mail</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Support Francophone 24/7</span>
              </span>
            </div>

          </div>

          {/* Right Column: High-Tech Glass Stream Cockpit Preview (Col 5) */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl titanium-card p-4 sm:p-5 border border-white/15 relative overflow-hidden shadow-2xl group">
              
              {/* Media Container with 4K badge */}
              <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden relative mb-4 bg-slate-950">
                <img
                  src="/src/assets/images/hero_hanout_lifestyle_1793971859738.jpg"
                  alt="Diffusion 4K HANOUT"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-70" />

                {/* Top overlay pills */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-white text-[11px] font-bold border border-white/10 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>FLUX DIRECT 4K</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-cyan-500/80 backdrop-blur-md text-black text-[11px] font-extrabold">
                    60 FPS
                  </span>
                </div>

                {/* Bottom Stream telemetry */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200">
                  <span className="font-mono text-[11px]">Bitrate: 34.2 Mb/s</span>
                  <span className="font-mono text-[11px] text-emerald-300">Latence: 12ms</span>
                </div>
              </div>

              {/* Cockpit Stats strip */}
              <div className="grid grid-cols-3 gap-2 text-center py-2 mb-3 border-y border-white/[0.08]">
                <div className="p-2 rounded-xl bg-slate-900/60">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Chaînes</div>
                  <div className="text-sm font-bold text-white font-mono">18 000+</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">VOD Films</div>
                  <div className="text-sm font-bold text-white font-mono">80 000+</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Disponibilité</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono">99.98%</div>
                </div>
              </div>

              {/* Quick Action inside Cockpit */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400">Compatible tous appareils</span>
                <button
                  onClick={onExploreTV}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                >
                  <span>Voir la démo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
