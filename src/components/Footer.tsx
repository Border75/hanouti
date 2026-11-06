import React from 'react';
import { Shield, Lock, CreditCard } from 'lucide-react';
import { LegalDocType } from './LegalModal.tsx';

interface FooterProps {
  onOpenLegal: (type: LegalDocType) => void;
  onOpenContact: () => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLegal,
  onOpenContact,
  onOpenTracking,
  onOpenAdmin
}) => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050508] text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/[0.06]">
          
          {/* Brand Manifesto Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-extrabold text-sm">
                H
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight">
                HANOUT
              </span>
            </div>
            
            <p className="text-zinc-300 font-medium text-xs">
              « Le digital, autrement. »
            </p>

            <p className="text-zinc-500 text-xs leading-relaxed max-w-sm">
              Plateforme e-commerce haut de gamme spécialisée dans la distribution de produits numériques vérifiés, licences certifiées et abonnements TV 4K autorisés à la revente.
            </p>

            <div className="flex items-center gap-3 pt-2 text-zinc-400">
              <span className="flex items-center gap-1.5 text-[11px] bg-zinc-900 border border-white/[0.06] px-2.5 py-1 rounded-md">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Paiements Chiffrés Stripe</span>
              </span>
              <span className="text-[11px] bg-zinc-900 border border-white/[0.06] px-2.5 py-1 rounded-md">
                Distribution Autorisée
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Boutique & Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="#catalogue" className="hover:text-white transition-colors">Tous les produits</a>
              </li>
              <li>
                <a href="#abonnements-tv" className="hover:text-white transition-colors">Abonnements TV Ultra 4K</a>
              </li>
              <li>
                <a href="#catalogue" className="hover:text-white transition-colors">Services de Confidentialité</a>
              </li>
              <li>
                <a href="#catalogue" className="hover:text-white transition-colors">Licences Logiciels Pro</a>
              </li>
            </ul>
          </div>

          {/* Client Space & Tracking */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Espace Client</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenTracking} className="hover:text-white transition-colors text-left">
                  Suivi de Commande & Clés
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('faq')} className="hover:text-white transition-colors text-left">
                  Foire Aux Questions (FAQ)
                </button>
              </li>
              <li>
                <button onClick={onOpenContact} className="hover:text-white transition-colors text-left">
                  Assistance Technique 24/7
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="text-zinc-500 hover:text-amber-400 transition-colors text-left flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>Accès Administration</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Informations Légales</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onOpenLegal('cgv')} className="hover:text-white transition-colors text-left">
                  Conditions Générales de Vente
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('mentions')} className="hover:text-white transition-colors text-left">
                  Mentions Légales
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('privacy')} className="hover:text-white transition-colors text-left">
                  Protection des données (RGPD)
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar with Payment Badges & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} HANOUT. Tous droits réservés. Le digital, autrement.
          </div>

          {/* Clean payment badges */}
          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <span className="font-semibold text-zinc-300">Paiement sécurisé par :</span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 font-medium text-white">Stripe</span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 font-medium text-white">Visa</span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 font-medium text-white">Mastercard</span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 font-medium text-white">Apple Pay</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
