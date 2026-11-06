import React, { useState, useEffect } from 'react';
import { X, Check, ShieldCheck, Zap, Star, ShoppingBag, ArrowUpRight, ExternalLink, HelpCircle } from 'lucide-react';
import { Product, DurationOption } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, startDirectCheckout } = useCart();
  const [selectedDuration, setSelectedDuration] = useState<DurationOption>(12);

  useEffect(() => {
    if (product) {
      const defaultDuration: DurationOption = product.availableDurations.includes(12) 
        ? 12 
        : (product.availableDurations[0] || 12);
      setSelectedDuration(defaultDuration);
    }
  }, [product]);

  if (!product) return null;

  const price = product.pricing?.[selectedDuration] ?? product.basePrice;
  const price12 = product.pricing?.[12] ?? product.basePrice;
  const hasSavings = selectedDuration === 24 && price12 > 0;
  const savingsPercent = hasSavings 
    ? Math.round(((price12 * 2 - price) / (price12 * 2)) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl apple-glass border border-white/[0.12] bg-[#0c0c10] shadow-2xl z-10 text-zinc-100 flex flex-col my-auto">
        
        {/* Sticky Modal Header / Close */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0c0c10]/90 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-semibold text-zinc-400 tracking-wider">
              {product.category === 'tv-subscriptions' ? 'Abonnement TV 4K' :
               product.category === 'digital-services' ? 'Service Numérique' :
               product.category === 'premium-subscriptions' ? 'Abonnement Premium' : 'Produit Digital'}
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-xs text-emerald-400 font-medium">Livraison Immédiate</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Top Hero Grid: Gallery Left + Purchase Module Right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Left: Product Image & Badges */}
            <div className="space-y-4">
              <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/[0.08] relative group">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {product.isBestSeller && (
                    <span className="px-3 py-1 rounded-md bg-white text-black text-xs font-bold shadow-md">
                      Meilleure Vente
                    </span>
                  )}
                </div>
              </div>

              {/* Rating & Trust badge */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/60 border border-white/[0.06] text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-white">{product.rating} / 5</span>
                  <span className="text-zinc-500">({product.reviewsCount} avis certifiés)</span>
                </div>

                <div className="flex items-center gap-1 text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Garanti 100%</span>
                </div>
              </div>
            </div>

            {/* Right: Contiguous Purchase Module */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {product.name}
                </h1>
                <p className="text-sm text-zinc-300 mt-2 font-medium">
                  {product.tagline}
                </p>

                {/* Duration selector */}
                {product.availableDurations.length > 1 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-xs text-zinc-300 mb-2">
                      <span className="font-semibold">Sélectionnez la durée de votre abonnement :</span>
                      {savingsPercent > 0 && (
                        <span className="text-amber-400 font-bold">Économisez {savingsPercent}%</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {product.availableDurations.map((dur) => {
                        const durPrice = product.pricing?.[dur] ?? product.basePrice;
                        const isSel = selectedDuration === dur;
                        return (
                          <button
                            key={dur}
                            type="button"
                            onClick={() => setSelectedDuration(dur)}
                            className={`p-3.5 rounded-2xl text-center border transition-all ${
                              isSel
                                ? 'bg-white text-black border-white font-bold shadow-lg'
                                : 'bg-zinc-900/80 text-zinc-300 border-white/[0.08] hover:border-white/20'
                            }`}
                          >
                            <div className="text-xs font-semibold">{dur === 24 ? '24 Mois (2 Ans)' : '12 Mois (1 An)'}</div>
                            <div className="text-base font-mono font-bold mt-1">{durPrice.toFixed(2)} €</div>
                            <div className={`text-[10px] mt-0.5 ${isSel ? 'text-zinc-600' : 'text-zinc-400'}`}>
                              soit {(durPrice / dur).toFixed(2)} € / mois
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Price Display */}
                <div className="mt-6 p-4 rounded-2xl bg-zinc-900/80 border border-white/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-zinc-400">Tarif pour {selectedDuration} mois :</span>
                    <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                      {price.toFixed(2)} € <span className="text-xs font-normal text-zinc-400">TTC</span>
                    </div>
                    {selectedDuration > 1 && (
                      <div className="text-[11px] text-zinc-400 font-mono">
                        Soit {(price / selectedDuration).toFixed(2)} € / mois
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <Zap className="w-4 h-4" />
                    <span>Activation 60s</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    startDirectCheckout(product, selectedDuration);
                  }}
                  className="w-full py-3.5 px-6 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-sm transition-all shadow-xl flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Acheter maintenant ({price.toFixed(2)} €)</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      addToCart(product, selectedDuration);
                      onClose();
                    }}
                    className="py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs border border-white/[0.08] transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Ajouter au panier</span>
                  </button>

                  {product.stripePaymentLink ? (
                    <a
                      href={product.stripePaymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 hover:text-white font-medium text-xs border border-white/[0.08] transition-colors flex items-center justify-center gap-1.5 text-center"
                    >
                      <span>Lien Stripe Direct</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <div className="py-3 px-4 rounded-xl bg-zinc-900 text-zinc-400 text-[11px] flex items-center justify-center text-center border border-white/[0.04]">
                      Paiement Stripe 100% Chiffré
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Description Section */}
          <div className="border-t border-white/[0.08] pt-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Présentation détaillée</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Features List */}
          <div className="border-t border-white/[0.08] pt-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Ce qui est inclus dans votre offre</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.features.map((feat, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-zinc-900/50 border border-white/[0.05] flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-xs text-zinc-200">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="border-t border-white/[0.08] pt-6 space-y-4">
              <h3 className="text-lg font-bold text-white">Spécifications techniques</h3>
              <div className="rounded-xl overflow-hidden border border-white/[0.08] divide-y divide-white/[0.06]">
                {product.specifications.map((spec, idx) => (
                  <div key={idx} className="flex justify-between p-3.5 bg-zinc-900/40 text-xs">
                    <span className="text-zinc-400 font-medium">{spec.label}</span>
                    <span className="text-white font-mono font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activation & Delivery Guide */}
          <div className="border-t border-white/[0.08] pt-6 p-5 rounded-2xl bg-zinc-900/70 border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wide">
              <Zap className="w-4 h-4" />
              <span>Modalités de livraison du produit numérique</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {product.deliveryGuide || 'Votre code d’accès sécurisé ou votre clé d’activation vous sera instantanément délivré sur la page de confirmation et par e-mail immédiatement après la validation de votre paiement Stripe.'}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
