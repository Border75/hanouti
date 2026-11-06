import React, { useState } from 'react';
import { ShoppingBag, Eye, Zap, ArrowUpRight, Star } from 'lucide-react';
import { Product, DurationOption } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
  featuredHighlight?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetail,
  featuredHighlight = false
}) => {
  const { startDirectCheckout, addToCart } = useCart();
  
  // Local duration selection (12 or 24 months)
  const defaultDuration: DurationOption = product.availableDurations.includes(12) 
    ? 12 
    : (product.availableDurations[0] || 12);

  const [selectedDuration, setSelectedDuration] = useState<DurationOption>(defaultDuration);

  const currentPrice = product.pricing?.[selectedDuration] ?? product.basePrice;

  // Calculate savings for 24 months compared to 2 years of 12-month plan
  const monthlyEquivalent = currentPrice / selectedDuration;
  const price12 = product.pricing?.[12] ?? product.basePrice;
  const hasSavings = selectedDuration === 24 && price12 > 0;
  const savingsPercent = hasSavings 
    ? Math.round(((price12 * 2 - currentPrice) / (price12 * 2)) * 100) 
    : 0;

  return (
    <div className={`group flex flex-col rounded-3xl transition-all duration-300 titanium-card hover:-translate-y-1.5 relative overflow-hidden ${
      featuredHighlight ? 'ring-1 ring-cyan-400/40' : ''
    }`}>
      
      {/* Top Media Container */}
      <div 
        className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950/80 cursor-pointer"
        onClick={() => onOpenDetail(product)}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Graceful fallback container if image load errors
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Subtle top indicator */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {product.isBestSeller ? (
            <span className="px-2.5 py-1 rounded-md bg-white text-black text-[11px] font-bold tracking-tight shadow-md">
              Meilleure Vente
            </span>
          ) : product.featured ? (
            <span className="px-2.5 py-1 rounded-md bg-zinc-900/90 text-white text-[11px] font-semibold border border-white/20 backdrop-blur-md">
              Sélection HANOUT
            </span>
          ) : <div />}

          <span className="px-2 py-0.5 rounded-md bg-black/60 text-zinc-300 text-[10px] font-medium backdrop-blur-md border border-white/10 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Instant 60s</span>
          </span>
        </div>

        {/* Quick View Button on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(product);
            }}
            className="px-4 py-2 rounded-xl bg-white/90 hover:bg-white text-black text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Fiche Détaillée</span>
          </button>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata Header (Zero-Pill Rule) */}
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <div className="flex items-center gap-2">
              <span className="capitalize font-medium text-zinc-300">
                {product.category === 'tv-subscriptions' ? 'Abonnement TV 4K' :
                 product.category === 'digital-services' ? 'Service Numérique' :
                 product.category === 'premium-subscriptions' ? 'Abonnement Premium' : 'Produit Digital'}
              </span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="text-emerald-400">En stock</span>
            </div>

            <div className="flex items-center gap-1 text-zinc-300">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold">{product.rating}</span>
              <span className="text-[11px] text-zinc-500">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onOpenDetail(product)}
            className="text-base font-bold text-white group-hover:text-zinc-200 transition-colors cursor-pointer line-clamp-1 mb-1.5"
          >
            {product.name}
          </h3>

          {/* Tagline / short description */}
          <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
            {product.tagline || product.description}
          </p>

          {/* Duration Selector Segmented Control */}
          {product.availableDurations.length > 1 && (
            <div className="mb-4">
              <div className="text-[11px] text-zinc-400 mb-1.5 flex items-center justify-between">
                <span>Durée de validité :</span>
                {savingsPercent > 0 && (
                  <span className="text-[10px] text-amber-400 font-semibold">
                    Économisez {savingsPercent}%
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-900/90 rounded-xl border border-white/[0.06]">
                {product.availableDurations.map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setSelectedDuration(dur)}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                      selectedDuration === dur
                        ? 'bg-white text-black shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>{dur === 24 ? '24 Mois (2 Ans)' : '12 Mois (1 An)'}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mini features preview */}
          <ul className="space-y-1 mb-5">
            {product.features.slice(0, 2).map((feat, idx) => (
              <li key={idx} className="text-[11px] text-zinc-300 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-zinc-500" />
                <span className="truncate">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing & Purchase Actions */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-zinc-400">Total TTC</div>
            <div className="text-xl font-extrabold text-white font-mono tabular-nums">
              {currentPrice.toFixed(2)} €
            </div>
            {selectedDuration > 1 && (
              <div className="text-[10px] text-zinc-500 font-mono">
                soit {monthlyEquivalent.toFixed(2)} € / mois
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => addToCart(product, selectedDuration)}
              title="Ajouter au panier"
              className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white transition-colors border border-white/[0.06] active:scale-95"
              aria-label="Ajouter au panier"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>

            <button
              onClick={() => startDirectCheckout(product, selectedDuration)}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1"
            >
              <span>Acheter</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
