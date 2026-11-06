import React from 'react';
import { X, ShieldCheck, FileText, HelpCircle } from 'lucide-react';

export type LegalDocType = 'cgv' | 'mentions' | 'privacy' | 'faq';

interface LegalModalProps {
  type: LegalDocType | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl apple-glass bg-[#0d0d12] border border-white/[0.12] p-6 sm:p-8 z-10 text-zinc-100 shadow-2xl my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">
              {type === 'cgv' && 'Conditions Générales de Vente (CGV)'}
              {type === 'mentions' && 'Mentions Légales & Droits'}
              {type === 'privacy' && 'Politique de Confidentialité & RGPD'}
              {type === 'faq' && 'Foire Aux Questions (FAQ)'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content based on type */}
        <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-4">
          
          {type === 'cgv' && (
            <>
              <p>
                <strong>1. Préambule :</strong> Les présentes conditions régissent les ventes de services numériques et d'abonnements TV autorisés proposées sur la boutique en ligne <strong>HANOUT</strong> (« Le digital, autrement. »).
              </p>
              <p>
                <strong>2. Nature des produits :</strong> HANOUT commercialise exclusivement des biens et contenus numériques dématérialisés. La fourniture des identifiants et clés de licence est exécutée immédiatement après confirmation sécurisée du paiement par notre partenaire Stripe.
              </p>
              <p>
                <strong>3. Prix et paiement :</strong> Tous les prix sont indiqués en euros (€) toutes taxes comprises (TTC). Le règlement s'effectue par carte bancaire sous protocole sécurisé 3D Secure via Stripe.
              </p>
              <p>
                <strong>4. Droit de rétractation et exécution immédiate :</strong> Conformément aux dispositions légales relatives aux contenus numériques fournis sans support matériel, le consommateur renonce expressément à son droit de rétractation dès la transmission des codes d'accès personnalisés.
              </p>
              <p>
                <strong>5. Garantie et assistance :</strong> HANOUT s'engage à assurer la continuité de service des abonnements souscrits pour la durée contractuelle choisie (1, 3, 6 ou 12 mois). En cas d'incident serveur, une réattribution ou un prolongement équivalent est garanti.
              </p>
            </>
          )}

          {type === 'mentions' && (
            <>
              <p>
                <strong>Éditeur du site :</strong> HANOUT Digital Commerce Technologies SAS.
              </p>
              <p>
                <strong>Marque :</strong> HANOUT – « Le digital, autrement. »
              </p>
              <p>
                <strong>Hébergement :</strong> Serveurs cloud hautement sécurisés avec protection DDoS avancée et certification ISO 27001.
              </p>
              <p>
                <strong>Distribution et Droits :</strong> HANOUT opère en conformité avec les autorisations de distribution et de revente des éditeurs partenaires. Toutes les marques citées demeurent la propriété de leurs détenteurs respectifs.
              </p>
              <p>
                <strong>Contact juridique :</strong> legal@hanout.digital
              </p>
            </>
          )}

          {type === 'privacy' && (
            <>
              <p>
                <strong>Protection des Données Personnelles :</strong> Conformément au RGPD européen, HANOUT ne collecte que les informations strictement indispensables à la livraison de vos abonnements numériques (nom, adresse e-mail pour l'envoi des identifiants).
              </p>
              <p>
                <strong>Aucune conservation bancaire :</strong> Toutes les données de carte de crédit sont traitées exclusivement par l'infrastructure certifiée PCI-DSS Niveau 1 de Stripe. HANOUT n'a jamais accès à vos numéros de carte.
              </p>
              <p>
                <strong>Vos droits :</strong> Vous disposez d'un droit d'accès, de rectification et d'effacement de vos données personnelles sur simple demande à notre délégué à la protection des données : dpo@hanout.digital.
              </p>
            </>
          )}

          {type === 'faq' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-white mb-1">Comment reçois-je mes identifiants après l'achat ?</h4>
                <p className="text-zinc-400">
                  Dès la validation de votre paiement par Stripe, vos identifiants (utilisateur, mot de passe, URL serveur et lien M3U) s'affichent instantanément à l'écran et vous sont envoyés par e-mail en moins de 60 secondes.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1">Quelles sont les applications compatibles ?</h4>
                <p className="text-zinc-400">
                  Nos flux sont 100% compatibles avec les applications les plus renommées du marché : TiviMate, IPTV Smarters Pro, IBO Player, XCIPTV, Smart IPTV, GSE Smart IPTV, sur Apple TV, Smart TV Samsung, LG, Firestick Amazon, smartphones et PC.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1">Puis-je utiliser mon abonnement sur plusieurs écrans ?</h4>
                <p className="text-zinc-400">
                  L'offre HANOUT TV Ultra standard inclut 1 connexion active à la fois. Si vous souhaitez regarder sur 2 ou 4 appareils en simultané, nous proposons la formule <strong>HANOUT TV Multi-Écrans Pro</strong>.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1">Que faire en cas de problème technique ?</h4>
                <p className="text-zinc-400">
                  Notre équipe de support technique est accessible 24h/24 et 7j/7 par le formulaire de contact ou par e-mail avec un temps de réponse moyen inférieur à 2 heures.
                </p>
              </div>
            </div>
          )}

        </div>

        <div className="mt-6 pt-4 border-t border-white/[0.08] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
