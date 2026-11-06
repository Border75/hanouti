import React from 'react';
import { Zap, ShieldCheck, Headphones, Award, RefreshCw, Lock } from 'lucide-react';

export const AdvantagesSection: React.FC = () => {
  const advantages = [
    {
      number: '01',
      title: 'Activation & Livraison en 60s',
      description: 'Dès validation de votre paiement Stripe, notre serveur automatise l’attribution de vos codes d’accès et vous les envoie par e-mail en temps réel.',
      icon: Zap,
    },
    {
      number: '02',
      title: 'Paiement 100% Sécurisé Stripe',
      description: 'Vos transactions sont protégées par le protocole bancaire 3D Secure et le chiffrement SSL 256 bits. Aucune coordonnée bancaire n’est conservée.',
      icon: Lock,
    },
    {
      number: '03',
      title: 'Services Autorisés & Conformes',
      description: 'HANOUT opère dans le respect strict des droits de revente et licences de distribution autorisées, garantissant pérennité et sérénité.',
      icon: ShieldCheck,
    },
    {
      number: '04',
      title: 'Infrastructure Anti-Gel 2026',
      description: 'Bénéficiez de clusters de serveurs haute performance répartis en Europe avec bande passante dédiée 10 Gbps pour un flux 4K constant.',
      icon: RefreshCw,
    },
    {
      number: '05',
      title: 'Assistance VIP Dédiée 24/7',
      description: 'Notre équipe technique francophone vous accompagne à tout moment par e-mail ou WhatsApp pour configurer votre équipement.',
      icon: Headphones,
    },
    {
      number: '06',
      title: 'Garantie Remplacement Immédiat',
      description: 'En cas de défaillance technique ou d’incompatibilité matérielle, nos équipes réassignent un nouvel accès sous 2 heures ouvrées.',
      icon: Award,
    },
  ];

  return (
    <section className="py-20 md:py-28 relative border-t border-white/[0.06] bg-[#060608]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-2">
            La signature HANOUT
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight text-balance">
            Pourquoi choisir HANOUT ?
          </h2>
          <p className="text-base text-zinc-400 mt-3">
            Le standard d’excellence dans l’univers des abonnements et services numériques.
          </p>
        </div>

        {/* 6 Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {advantages.map((adv, idx) => {
            const Icon = adv.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl apple-glass-card border border-white/[0.06] flex flex-col justify-between hover:border-white/20 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      {adv.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:scale-105 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-zinc-100 transition-colors">
                    {adv.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {adv.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
