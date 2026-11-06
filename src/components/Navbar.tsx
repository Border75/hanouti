import React, { useState } from 'react';
import { ShoppingBag, Shield, Menu, X, Sparkles, Tv, HelpCircle } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenTracking: () => void;
  onOpenContact: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  onOpenTracking,
  onOpenContact,
  isAdminLoggedIn
}) => {
  const { totalCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-0 z-40 w-full transition-all">
      {/* Top Announcement Ribbon */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border-b border-cyan-500/20 py-1.5 px-4 text-center text-[11px] text-slate-300 flex items-center justify-center gap-2">
        <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
        <span>Offres Longue Durée Exclusives : 12 Mois & 24 Mois · Activation garantie en 60s chrono</span>
        <span className="hidden sm:inline text-slate-500">|</span>
        <span className="hidden sm:inline text-cyan-300 font-bold">Paiement Stripe 100% Sécurisé</span>
      </div>

      <header className="w-full titanium-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex items-center gap-2.5 text-white tracking-wider"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 via-sky-300 to-blue-600 flex items-center justify-center text-black font-extrabold text-sm shadow-md group-hover:scale-105 transition-transform">
                H
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg tracking-tight text-white group-hover:text-cyan-200 transition-colors">
                  HANOUT
                </span>
              </div>
            </a>
            <span className="hidden sm:inline-block text-[11px] text-slate-400 font-medium tracking-wide">
              Le digital, autrement.
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              Accueil
            </button>
            <button
              onClick={() => scrollToSection('bento-univers')}
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              Écosystème
            </button>
            <button
              onClick={() => scrollToSection('abonnements-tv')}
              className="hover:text-white transition-colors whitespace-nowrap flex items-center gap-1.5 text-cyan-300"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Abonnements TV 4K</span>
            </button>
            <button
              onClick={() => scrollToSection('comparatif')}
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              Comparatif 12M / 24M
            </button>
            <button
              onClick={() => scrollToSection('catalogue')}
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              Boutique
            </button>
            <button
              onClick={onOpenTracking}
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              Suivi Commande
            </button>
            <button
              onClick={onOpenContact}
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: Actions (Cart & Admin) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Currency Pill */}
            <span className="hidden lg:inline-flex items-center px-2 py-1 rounded-md bg-slate-800/80 border border-white/[0.08] text-[10px] font-mono font-bold text-slate-400">
              EUR (€)
            </span>

            {/* Admin shortcut button */}
            <button
              onClick={onOpenAdmin}
              title={isAdminLoggedIn ? 'Tableau de bord Admin' : 'Accès Administrateur'}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isAdminLoggedIn
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/10'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isAdminLoggedIn ? 'Espace Admin' : 'Admin'}
              </span>
            </button>

            {/* Cart button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black text-xs font-extrabold transition-all flex items-center gap-2 shadow-lg active:scale-95"
              aria-label="Voir le panier"
            >
              <ShoppingBag className="w-4 h-4 text-black" />
              <span className="hidden sm:inline">Panier</span>
              {totalCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-black text-cyan-300 text-[11px] font-extrabold flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-[#090d18] px-4 pt-3 pb-6 space-y-3">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm text-slate-200 hover:text-white font-medium"
            >
              Accueil
            </button>
            <button
              onClick={() => scrollToSection('bento-univers')}
              className="block w-full text-left py-2 text-sm text-slate-200 hover:text-white font-medium"
            >
              Écosystème des services
            </button>
            <button
              onClick={() => scrollToSection('abonnements-tv')}
              className="block w-full text-left py-2 text-sm text-cyan-400 font-bold"
            >
              Abonnements TV 4K
            </button>
            <button
              onClick={() => scrollToSection('comparatif')}
              className="block w-full text-left py-2 text-sm text-slate-200 hover:text-white font-medium"
            >
              Comparatif 12M / 24M
            </button>
            <button
              onClick={() => scrollToSection('catalogue')}
              className="block w-full text-left py-2 text-sm text-slate-200 hover:text-white font-medium"
            >
              Boutique Complète
            </button>
            <button
              onClick={() => {
                onOpenTracking();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm text-slate-200 hover:text-white font-medium"
            >
              Suivi Commande & Identifiants
            </button>
            <button
              onClick={() => {
                onOpenContact();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm text-slate-200 hover:text-white font-medium"
            >
              Support & Contact
            </button>
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 py-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isAdminLoggedIn ? 'Tableau de bord Admin' : 'Accès Espace Admin'}</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};
