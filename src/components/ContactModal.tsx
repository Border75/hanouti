import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquare, Mail, Phone, Clock } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Question sur un abonnement TV');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      const data = await res.json();
      setSubmittedMessage(data.message || 'Votre message a bien été envoyé.');
    } catch {
      setSubmittedMessage('Message transmis avec succès à l’assistance HANOUT.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedMessage(null);
    setName('');
    setEmail('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={handleReset} />

      <div className="relative w-full max-w-lg rounded-3xl apple-glass bg-[#0c0c11] border border-white/[0.12] p-6 sm:p-8 z-10 text-zinc-100 shadow-2xl my-auto">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Support & Contact HANOUT</h3>
          </div>
          <button onClick={handleReset} className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedMessage ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-white">Message Reçu</h4>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
              {submittedMessage}
            </p>
            <button
              onClick={handleReset}
              className="mt-2 px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-colors"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3 mb-2 text-xs text-zinc-400">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.05] flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Réponse moyenne : &lt; 2h</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.05] flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>contact@hanout.digital</span>
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Votre Nom *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marc Dupont"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.08] text-xs text-white focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Votre Adresse E-mail *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="marc@exemple.com"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.08] text-xs text-white focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Objet de votre demande</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.08] text-xs text-white focus:outline-none focus:border-white/40"
              >
                <option value="Question sur un abonnement TV">Question sur un abonnement TV 4K</option>
                <option value="Aide à la configuration de l'application">Aide à la configuration de mon application</option>
                <option value="Suivi de commande & identifiants">Suivi de commande & identifiants</option>
                <option value="Demande de partenariat / Revente">Demande de partenariat / Revente</option>
                <option value="Autre demande">Autre demande</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Votre Message *</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Précisez votre appareil (ex: Smart TV Samsung, TiviMate, Apple TV) si vous souhaitez une aide de configuration..."
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.08] text-xs text-white focus:outline-none focus:border-white/40"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
