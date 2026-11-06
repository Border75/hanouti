import React from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { DurationOption } from '../types.ts';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateItemDuration,
    totalAmount,
    totalCount,
    setIsCheckoutOpen
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md apple-glass bg-[#0d0d12] border-l border-white/[0.08] text-zinc-100 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-white" />
              <h2 className="text-base font-bold text-white">Votre Panier HANOUT</h2>
              <span className="text-xs text-zinc-400">({totalCount})</span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-zinc-900 border border-white/[0.08] flex items-center justify-center mx-auto text-zinc-500">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <p className="text-sm text-zinc-400">Votre panier est actuellement vide.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors"
                >
                  Découvrir les offres
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-zinc-900/70 border border-white/[0.06] flex gap-4 relative group"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover bg-zinc-950 shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-white truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-500 hover:text-rose-400 transition-colors p-0.5"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Duration changer */}
                    <div className="flex items-center gap-2 mt-2">
                      <label className="text-[11px] text-zinc-400">Durée :</label>
                      <select
                        value={item.duration}
                        onChange={(e) => updateItemDuration(item.id, Number(e.target.value) as DurationOption)}
                        className="bg-zinc-800 border border-white/[0.1] text-xs text-white rounded px-2 py-0.5 focus:outline-none"
                      >
                        {item.product.availableDurations.map(dur => (
                          <option key={dur} value={dur}>{dur === 24 ? '24 Mois (2 Ans)' : '12 Mois (1 An)'}</option>
                        ))}
                      </select>
                    </div>

                    {/* Price */}
                    <div className="mt-3 flex items-baseline justify-between">
                      <span className="text-[11px] text-emerald-400 font-medium">Activation 60s</span>
                      <span className="text-sm font-bold text-white font-mono tabular-nums">
                        {item.price.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-white/[0.08] bg-[#09090c] space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Sous-total articles</span>
                  <span className="font-mono text-zinc-200">{totalAmount.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Frais de livraison numérique</span>
                  <span className="text-emerald-400 font-medium">Gratuit (Instantané)</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/[0.06]">
                  <span>Total à payer</span>
                  <span className="font-mono text-xl">{totalAmount.toFixed(2)} €</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-[0.98]"
              >
                <span>Commander sécurisé (Stripe)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Paiement chiffré SSL 256 bits · Stripe & PayPal</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
