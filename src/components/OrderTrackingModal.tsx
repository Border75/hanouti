import React, { useState } from 'react';
import { X, Search, CheckCircle2, Copy, Check, Printer, Clock, AlertCircle } from 'lucide-react';
import { Order } from '../types.ts';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ isOpen, onClose }) => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setFoundOrder(null);

    if (!orderId.trim() || !email.trim()) {
      setErrorMsg('Veuillez renseigner le numéro de commande et l’adresse e-mail.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders/track?orderId=${encodeURIComponent(orderId.trim())}&email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Commande introuvable.');
      }

      setFoundOrder(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Impossible de trouver cette commande.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl apple-glass bg-[#0d0d12] border border-white/[0.12] p-6 sm:p-8 z-10 text-zinc-100 shadow-2xl my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Suivi de commande & Identifiants</h3>
            <p className="text-xs text-zinc-400">Consultez vos codes d’accès et le statut de votre livraison</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">Numéro de commande</label>
              <input
                type="text"
                placeholder="Ex : HNT-2026-8941"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
              />
            </div>
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">E-mail de commande</label>
              <input
                type="email"
                placeholder="votre.email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Recherche...' : 'Rechercher la commande'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOrderId('HNT-2026-8941');
                setEmail('marc.lefebvre@example.com');
              }}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 underline"
            >
              Tester un exemple
            </button>
          </div>
        </form>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Order Details Result */}
        {foundOrder && (
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold">{foundOrder.id}</span>
                <p className="text-[11px] text-zinc-400">{new Date(foundOrder.createdAt).toLocaleDateString('fr-FR')}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                  foundOrder.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  Paiement {foundOrder.paymentStatus === 'paid' ? 'Validé' : 'En attente'}
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/10 text-white">
                  Livré
                </span>
              </div>
            </div>

            {/* Delivered Items */}
            {foundOrder.items.map((it, idx) => (
              <div key={idx} className="space-y-3 pt-2">
                <div className="flex justify-between text-xs font-bold text-white">
                  <span>{it.productName} ({it.duration === 24 ? '24 Mois · 2 Ans' : '12 Mois · 1 An'})</span>
                  <span className="font-mono">{it.price.toFixed(2)} €</span>
                </div>

                {it.deliveryDetails?.licenseKey && (
                  <div className="p-3 rounded-xl bg-black/60 border border-white/[0.06] flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[10px] text-zinc-500 uppercase font-semibold">Clé de licence</div>
                      <div className="text-xs font-mono text-emerald-400 font-bold truncate">
                        {it.deliveryDetails.licenseKey}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(it.deliveryDetails!.licenseKey!, `track-key-${idx}`)}
                      className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-white"
                    >
                      {copiedKey === `track-key-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                )}

                {it.deliveryDetails?.username && (
                  <div className="p-3 rounded-xl bg-black/60 border border-white/[0.06] text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Identifiant :</span>
                      <span className="font-mono text-white font-bold">{it.deliveryDetails.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Mot de passe :</span>
                      <span className="font-mono text-amber-400 font-bold">{it.deliveryDetails.password}</span>
                    </div>
                    {it.deliveryDetails.serverUrl && (
                      <div className="flex justify-between">
                        <span className="text-zinc-400">URL Serveur :</span>
                        <span className="font-mono text-zinc-300">{it.deliveryDetails.serverUrl}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-zinc-400">Total payé</span>
              <span className="text-base font-bold font-mono text-white">{foundOrder.totalAmount.toFixed(2)} €</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
