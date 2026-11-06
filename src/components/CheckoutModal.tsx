import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, CreditCard, Copy, Check, Printer, ArrowRight, Zap, ExternalLink } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { Order } from '../types.ts';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, closeCheckout, directCheckoutItem, cart, totalAmount, clearCart } = useCart();

  const itemsToBuy = directCheckoutItem 
    ? [directCheckoutItem] 
    : cart;

  const checkoutTotal = directCheckoutItem 
    ? directCheckoutItem.price 
    : totalAmount;

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentProvider, setPaymentProvider] = useState<'stripe' | 'paypal'>('stripe');

  // Simulated Card Details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Processing & Confirmation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleProcessCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim() || !customerEmail.trim()) {
      setErrorMsg('Veuillez renseigner votre nom et une adresse e-mail valide pour recevoir vos accès.');
      return;
    }

    if (paymentProvider === 'stripe' && (!cardNumber.trim() || !cardExpiry.trim() || !cardCvc.trim())) {
      setErrorMsg('Veuillez saisir les coordonnées de votre carte bancaire de test.');
      return;
    }

    setIsProcessing(true);

    try {
      // Call Server-Side Checkout Verification Endpoint
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim() || undefined,
          paymentProvider,
          items: itemsToBuy.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            duration: item.duration,
            price: item.price,
            category: item.product.category,
            imageUrl: item.product.imageUrl
          }))
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la validation du paiement');
      }

      // Order confirmed on server
      setConfirmedOrder(data.order);
      if (!directCheckoutItem) {
        clearCart();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Échec du traitement sécurisé. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAndClose = () => {
    setConfirmedOrder(null);
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
    closeCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={resetAndClose} 
      />

      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl apple-glass bg-[#0c0c11] border border-white/[0.12] shadow-2xl z-10 text-zinc-100 flex flex-col my-auto">
        
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0c0c11]/90 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-xs uppercase font-bold text-white tracking-wider">
              {confirmedOrder ? 'Confirmation de commande' : 'Paiement Sécurisé Stripe 256 bits'}
            </span>
          </div>

          <button
            onClick={resetAndClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8">
          
          {confirmedOrder ? (
            /* ================= ORDER CONFIRMATION SCREEN ================= */
            <div className="space-y-6">
              
              {/* Success Badge */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h2 className="text-2xl font-extrabold text-white">
                  Paiement Confirmé !
                </h2>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  Votre transaction a été validée avec succès par Stripe. Vos identifiants ont été activés et envoyés à <span className="text-white font-medium">{confirmedOrder.customerEmail}</span>.
                </p>
                <div className="inline-block px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs text-zinc-300 font-mono">
                  N° Commande : <span className="text-amber-400 font-bold">{confirmedOrder.id}</span>
                </div>
              </div>

              {/* Digital Goods Delivery Box */}
              <div className="rounded-2xl bg-zinc-900/90 border border-white/[0.1] p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    <span>Vos accès numériques délivrés</span>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-medium">Statut : Livré</span>
                </div>

                {confirmedOrder.items.map((item, idx) => (
                  <div key={idx} className="space-y-3 pt-2">
                    <div className="text-sm font-bold text-white flex items-center justify-between">
                      <span>{item.productName} ({item.duration === 24 ? '24 Mois · 2 Ans' : '12 Mois · 1 An'})</span>
                      <span className="font-mono text-zinc-400 text-xs">{item.price.toFixed(2)} €</span>
                    </div>

                    {item.deliveryDetails?.licenseKey && (
                      <div className="p-3 rounded-xl bg-black/60 border border-white/[0.08] flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-[10px] text-zinc-500 uppercase font-semibold">Clé de licence officielle</div>
                          <div className="text-sm font-mono text-emerald-400 font-bold tracking-wider truncate">
                            {item.deliveryDetails.licenseKey}
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopy(item.deliveryDetails!.licenseKey!, `key-${idx}`)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-white transition-colors flex items-center gap-1 shrink-0"
                        >
                          {copiedKey === `key-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === `key-${idx}` ? 'Copié' : 'Copier'}</span>
                        </button>
                      </div>
                    )}

                    {item.deliveryDetails?.username && (
                      <div className="space-y-2 p-3 rounded-xl bg-black/60 border border-white/[0.08]">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-400">Identifiant :</span>
                          <span className="font-mono text-white font-bold">{item.deliveryDetails.username}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-400">Mot de passe :</span>
                          <span className="font-mono text-amber-400 font-bold">{item.deliveryDetails.password}</span>
                        </div>
                        {item.deliveryDetails.serverUrl && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-400">URL Serveur :</span>
                            <span className="font-mono text-zinc-300 truncate max-w-[200px]">{item.deliveryDetails.serverUrl}</span>
                          </div>
                        )}
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => handleCopy(`User: ${item.deliveryDetails!.username}\nPass: ${item.deliveryDetails!.password}\nServer: ${item.deliveryDetails!.serverUrl}`, `cred-${idx}`)}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-white transition-colors flex items-center gap-1"
                          >
                            {copiedKey === `cred-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>Copier tous les identifiants</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <p className="text-[11px] text-zinc-400 italic">
                      {item.deliveryDetails?.activationInstructions}
                    </p>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-1/2 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer le reçu</span>
                </button>

                <button
                  onClick={resetAndClose}
                  className="w-full sm:w-1/2 py-3 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-all shadow-md"
                >
                  Terminer mes achats
                </button>
              </div>

            </div>
          ) : (
            /* ================= CHECKOUT FORM ================= */
            <form onSubmit={handleProcessCheckout} className="space-y-6">
              
              {/* Order Recap Mini Header */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="text-xs text-zinc-400">Articles sélectionnés :</div>
                  <div className="text-sm font-bold text-white">
                    {itemsToBuy.length} prestation(s) numérique(s)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-400">Montant total</div>
                  <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
                    {checkoutTotal.toFixed(2)} €
                  </div>
                </div>
              </div>

              {/* Section 1: Customer Contact Info */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  1. Informations pour la livraison numérique
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jean Dupont"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      Adresse e-mail (Réception immédiate des accès) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jean.dupont@email.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">
                    Numéro de téléphone WhatsApp (Optionnel pour assistance d'activation)
                  </label>
                  <input
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              {/* Section 2: Payment Provider Selection */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  2. Méthode de paiement sécurisée
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentProvider('stripe')}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      paymentProvider === 'stripe'
                        ? 'bg-white/10 border-white text-white font-bold shadow-md'
                        : 'bg-zinc-900/60 border-white/[0.06] text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs">Stripe (CB / Apple Pay)</span>
                    </div>
                    {paymentProvider === 'stripe' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentProvider('paypal')}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      paymentProvider === 'paypal'
                        ? 'bg-white/10 border-white text-white font-bold shadow-md'
                        : 'bg-zinc-900/60 border-white/[0.06] text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-400">P</span>
                      <span className="text-xs">PayPal Express</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">Prévu</span>
                  </button>
                </div>

                {/* Direct Stripe link option if available on direct item */}
                {directCheckoutItem?.product.stripePaymentLink && (
                  <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Vous préférez le guichet Stripe officiel ?</span>
                    <a
                      href={directCheckoutItem.product.stripePaymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Ouvrir Stripe Direct</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {paymentProvider === 'stripe' ? (
                  /* Card fields */
                  <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/[0.08] space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                      <span className="text-[11px] text-zinc-400 font-medium">Carte Bancaire (Visa, Mastercard, Amex)</span>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                        <Lock className="w-3 h-3" />
                        <span>Chiffrement AES-256</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">Numéro de carte</label>
                      <input
                        type="text"
                        placeholder="4242 •••• •••• 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/[0.08] text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-zinc-400 mb-1">Expiration (MM/AA)</label>
                        <input
                          type="text"
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/[0.08] text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-400 mb-1">CVC / CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/[0.08] text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-blue-200">
                    L'intégration de PayPal Express est prête pour la liaison API. Pour ce test, choisissez Stripe pour une validation instantanée.
                  </div>
                )}
              </div>

              {/* Error notice */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300">
                  {errorMsg}
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 rounded-xl bg-white text-black font-extrabold text-sm uppercase tracking-wider hover:bg-zinc-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-[0.98]"
                >
                  {isProcessing ? (
                    <span>Vérification bancaire Stripe en cours...</span>
                  ) : (
                    <>
                      <span>Payer {checkoutTotal.toFixed(2)} € et recevoir mes accès</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Trust Footer */}
              <div className="text-center text-[11px] text-zinc-500">
                Transaction protégée par Stripe Checkout. En confirmant votre commande, vous acceptez nos CGV et la livraison immédiate de votre bien numérique.
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
