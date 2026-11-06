import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, Shield, LogOut, Plus, Edit2, Trash2, CheckCircle2, TrendingUp, 
  ShoppingBag, DollarSign, Package, AlertCircle, Eye, EyeOff, Save, RefreshCw, 
  ExternalLink, Copy, Check, Download, Mail, Filter, Search, SlidersHorizontal, Settings, FileText, Layers
} from 'lucide-react';
import { Product, Order, AdminStats, DurationOption, ProductCategory } from '../types.ts';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminToken: string | null;
  onLoginSuccess: (token: string) => void;
  onLogout: () => void;
  onProductsUpdated: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  adminToken,
  onLoginSuccess,
  onLogout,
  onProductsUpdated
}) => {
  // Login Form State
  const [email, setEmail] = useState('bader153@gmail.com');
  const [password, setPassword] = useState('Bader1965@');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'orders' | 'settings'>('stats');

  // Admin Data State
  const [stats, setStats] = useState<(AdminStats & { durationSplit?: { m12: number; m24: number } }) | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [storeSettings, setStoreSettings] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Search & Filters for Products
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  // Search & Filters for Orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Product Editing / Creation State
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [productFormMsg, setProductFormMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Inspect specific order details modal
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && adminToken) {
      loadAdminData();
    }
  }, [isOpen, adminToken, activeTab]);

  const loadAdminData = async () => {
    if (!adminToken) return;
    setIsLoadingData(true);
    try {
      const headers = { 'Authorization': `Bearer ${adminToken}` };
      
      const [statsRes, productsRes, ordersRes, settingsRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/products?all=true', { headers }),
        fetch('/api/admin/orders', { headers }),
        fetch('/api/admin/settings', { headers })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (settingsRes.ok) setStoreSettings(await settingsRes.json());
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Identifiants invalides');
      }

      onLoginSuccess(data.token);
    } catch (err: any) {
      setLoginError(err.message || 'Erreur d’authentification');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !adminToken) return;

    setIsSavingProduct(true);
    setProductFormMsg(null);

    try {
      const isNew = !editingProduct.id;
      const url = isNew ? '/api/products' : `/api/products/${editingProduct.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(editingProduct)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l’enregistrement du produit');
      }

      showToast(`Produit « ${editingProduct.name} » sauvegardé avec succès.`);
      setEditingProduct(null);
      await loadAdminData();
      onProductsUpdated();
    } catch (err: any) {
      setProductFormMsg({ type: 'error', text: err.message || 'Erreur' });
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDuplicateProduct = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.id}/duplicate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (!res.ok) throw new Error('Échec duplication');
      showToast(`Produit dupliqué avec succès : ${product.name} (Copie)`);
      await loadAdminData();
      onProductsUpdated();
    } catch {
      alert('Impossible de dupliquer ce produit.');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Confirmez-vous la suppression définitive du produit « ${name} » ?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      if (!res.ok) throw new Error('Échec de la suppression');

      showToast(`Produit « ${name} » supprimé.`);
      await loadAdminData();
      onProductsUpdated();
    } catch (err) {
      alert('Impossible de supprimer ce produit.');
    }
  };

  const handleToggleProductActive = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ active: !product.active })
      });

      if (res.ok) {
        await loadAdminData();
        onProductsUpdated();
        showToast(`Statut du produit modifié : ${!product.active ? 'Actif' : 'Désactivé'}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, paymentStatus?: string, deliveryStatus?: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ paymentStatus, deliveryStatus })
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
        if (inspectingOrder?.id === orderId) setInspectingOrder(updated);
        showToast(`Statut de la commande ${orderId} mis à jour.`);
      }
    } catch (err) {
      alert('Impossible de modifier le statut de la commande.');
    }
  };

  const handleResendCredentials = async (order: Order) => {
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/resend`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      showToast(data.message || `E-mail renvoyé à ${order.customerEmail}`);
    } catch {
      alert('Erreur lors de l’envoi de l’email.');
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return;
    const headers = ['ID_Commande', 'Date', 'Nom_Client', 'Email', 'Telephone', 'Montant_EUR', 'Statut_Paiement', 'Statut_Livraison', 'Articles'];
    const rows = orders.map(o => [
      o.id,
      o.createdAt,
      `"${o.customerName}"`,
      o.customerEmail,
      o.customerPhone || '',
      o.totalAmount,
      o.paymentStatus,
      o.deliveryStatus,
      `"${o.items.map(it => `${it.productName} (${it.duration}M)`).join('; ')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HANOUT_Commandes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export CSV téléchargé avec succès.');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(storeSettings)
      });
      if (res.ok) {
        showToast('Paramètres de la boutique mis à jour avec succès.');
      }
    } catch {
      alert('Erreur lors de la sauvegarde des paramètres.');
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) return false;
      if (productSearch.trim()) {
        const query = productSearch.toLowerCase();
        return p.name.toLowerCase().includes(query) || p.id.toLowerCase().includes(query);
      }
      return true;
    });
  }, [products, productCategoryFilter, productSearch]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (orderStatusFilter !== 'all' && o.paymentStatus !== orderStatusFilter && o.deliveryStatus !== orderStatusFilter) {
        return false;
      }
      if (orderSearch.trim()) {
        const query = orderSearch.toLowerCase();
        return (
          o.id.toLowerCase().includes(query) ||
          o.customerEmail.toLowerCase().includes(query) ||
          o.customerName.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-3xl titanium-card bg-[#090d18] border border-white/15 z-10 text-slate-100 flex flex-col shadow-2xl my-auto">
        
        {/* Top Header Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#090d18]/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-black flex items-center justify-center font-bold text-sm shadow-md">
              <Shield className="w-4 h-4 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-white">Tableau de Bord Administrateur</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  LIVE
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block">Gestion complète · HANOUT Digital</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {toastMsg && (
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold animate-fade-in">
                {toastMsg}
              </span>
            )}

            {adminToken && (
              <button
                onClick={onLogout}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="p-6 sm:p-8">
          
          {!adminToken ? (
            /* ================= LOGIN FORM ================= */
            <div className="max-w-md mx-auto py-12">
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4 text-cyan-400">
                  <Shield className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white">Accès Espace Administrateur</h3>
                <p className="text-xs text-slate-400 mt-1.5">
                  Gestion sécurisée du catalogue produits, suivi des encaissements Stripe et CRM clients
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-semibold">Identifiant Administrateur</label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-semibold">Mot de passe secret</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {loginError && (
                  <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-lg active:scale-[0.98]"
                >
                  {isLoggingIn ? 'Authentification...' : 'Ouvrir le panneau d’administration'}
                </button>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06] text-xs text-slate-400 text-center">
                  Identifiants administrateur :<br/>
                  <span className="text-white font-mono font-semibold">bader153@gmail.com</span> / <span className="text-white font-mono font-semibold">Bader1965@</span>
                </div>
              </form>
            </div>
          ) : (
            /* ================= FULL ADMIN DASHBOARD ================= */
            <div className="space-y-6">
              
              {/* Top Navigation Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2 overflow-x-auto">
                  <button
                    onClick={() => { setActiveTab('stats'); setEditingProduct(null); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      activeTab === 'stats'
                        ? 'bg-white text-black shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Vue Analytique</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('products'); setEditingProduct(null); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      activeTab === 'products'
                        ? 'bg-white text-black shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    <span>Catalogue Produits ({products.length})</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('orders'); setEditingProduct(null); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      activeTab === 'orders'
                        ? 'bg-white text-black shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Tableau Commandes & CRM ({orders.length})</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('settings'); setEditingProduct(null); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      activeTab === 'settings'
                        ? 'bg-white text-black shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Paramètres Boutique</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadAdminData}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs transition-colors"
                    title="Actualiser les données"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Actualiser</span>
                  </button>
                </div>
              </div>

              {/* ================= TAB 1: EXECUTIVE ANALYTICS ================= */}
              {activeTab === 'stats' && stats && (
                <div className="space-y-8">
                  
                  {/* KPI Cards Strip */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl titanium-card">
                      <span className="text-xs text-slate-400 font-semibold uppercase">Chiffre d'Affaires</span>
                      <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1">
                        {stats.totalRevenue.toFixed(2)} €
                      </div>
                      <span className="text-[11px] text-emerald-400 mt-1 block">100% encaissé via Stripe</span>
                    </div>

                    <div className="p-5 rounded-2xl titanium-card">
                      <span className="text-xs text-slate-400 font-semibold uppercase">Total Commandes</span>
                      <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1">
                        {stats.totalOrders}
                      </div>
                      <span className="text-[11px] text-cyan-400 mt-1 block">Livraison instantanée</span>
                    </div>

                    <div className="p-5 rounded-2xl titanium-card">
                      <span className="text-xs text-slate-400 font-semibold uppercase">Panier Moyen</span>
                      <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1">
                        {stats.averageOrderValue.toFixed(2)} €
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 block">Durées 12M & 24M</span>
                    </div>

                    <div className="p-5 rounded-2xl titanium-card">
                      <span className="text-xs text-slate-400 font-semibold uppercase">Répartition Formules</span>
                      <div className="text-lg font-bold text-white mt-1 flex items-center gap-3">
                        <span className="text-slate-300 font-mono">12M: {stats.durationSplit?.m12 || 1}</span>
                        <span className="text-cyan-400 font-mono">24M: {stats.durationSplit?.m24 || 2}</span>
                      </div>
                      <span className="text-[11px] text-cyan-300 mt-1 block">Forte adoption 24 mois</span>
                    </div>
                  </div>

                  {/* Monthly Histogram & Category Matrix */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Monthly Revenue Bars */}
                    <div className="p-6 rounded-2xl titanium-card space-y-4">
                      <h4 className="text-sm font-bold text-white flex items-center justify-between">
                        <span>Évolution du Chiffre d'Affaires</span>
                        <span className="text-xs text-slate-400 font-normal">Mensuel (€)</span>
                      </h4>

                      <div className="space-y-3 pt-2">
                        {stats.monthlyRevenue.map((m, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-300 font-mono">{m.month}</span>
                              <span className="text-white font-mono font-bold">{m.amount.toFixed(2)} €</span>
                            </div>
                            <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                                style={{ width: `${Math.min(100, Math.max(15, (m.amount / (stats.totalRevenue || 1)) * 100))}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="p-6 rounded-2xl titanium-card space-y-4">
                      <h4 className="text-sm font-bold text-white">Ventes par Catégorie de Services</h4>
                      <div className="space-y-3 pt-2">
                        {stats.categoryBreakdown.map((cat, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.05] flex items-center justify-between">
                            <div>
                              <span className="text-xs font-bold text-white capitalize">{cat.category}</span>
                              <span className="text-[11px] text-slate-400 block">{cat.count} souscription(s)</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-bold text-cyan-300 font-mono">{cat.revenue.toFixed(2)} €</span>
                              <span className="text-[10px] text-slate-500 block">TTC</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* ================= TAB 2: PRODUCTS MANAGER ================= */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  
                  {/* Action & Filter Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="relative w-full sm:w-64">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Chercher un produit ou ID..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <select
                        value={productCategoryFilter}
                        onChange={(e) => setProductCategoryFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300 focus:outline-none"
                      >
                        <option value="all">Toutes catégories</option>
                        <option value="tv-subscriptions">Abonnements TV</option>
                        <option value="digital-services">Services numériques</option>
                        <option value="premium-subscriptions">Abonnements premium</option>
                        <option value="digital-products">Produits digitaux</option>
                      </select>
                    </div>

                    <button
                      onClick={() => setEditingProduct({
                        name: '',
                        slug: '',
                        category: 'tv-subscriptions',
                        basePrice: 89.99,
                        pricing: { 12: 89.99, 24: 149.99 },
                        availableDurations: [12, 24],
                        tagline: '',
                        description: '',
                        active: true,
                        featured: false,
                        isBestSeller: false,
                        imageUrl: '/src/assets/images/product_hanout_tv_stream_1793971861184.jpg',
                        features: ['18 000+ Chaînes 4K UHD', 'Replay & VOD inclus', 'Livraison instantanée par email'],
                        specifications: [
                          { label: 'Qualité vidéo', value: '4K UHD 60 FPS' },
                          { label: 'Validité', value: '12 ou 24 mois' }
                        ],
                        stripePaymentLink: ''
                      })}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md hover:from-cyan-300 hover:to-blue-400 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Ajouter un Produit</span>
                    </button>
                  </div>

                  {/* Product Form Editor (Modal / Expandable block) */}
                  {editingProduct && (
                    <form onSubmit={handleSaveProduct} className="p-6 rounded-2xl bg-slate-900/95 border-2 border-cyan-500/40 space-y-5">
                      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                        <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                          <Edit2 className="w-4 h-4 text-cyan-400" />
                          <span>{editingProduct.id ? `Modifier : ${editingProduct.name}` : 'Nouveau Produit au Catalogue'}</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Fermer
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1 font-semibold">Nom du Produit *</label>
                          <input
                            type="text"
                            required
                            value={editingProduct.name || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1 font-semibold">Catégorie *</label>
                          <select
                            value={editingProduct.category || 'tv-subscriptions'}
                            onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
                          >
                            <option value="tv-subscriptions">Abonnements TV</option>
                            <option value="digital-services">Services numériques</option>
                            <option value="premium-subscriptions">Abonnements premium</option>
                            <option value="digital-products">Produits digitaux</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1 font-semibold">Slogan / Phrase d'accroche</label>
                        <input
                          type="text"
                          value={editingProduct.tagline || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1 font-semibold">Description détaillée</label>
                        <textarea
                          rows={3}
                          value={editingProduct.description || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
                        />
                      </div>

                      {/* Pricing 12 and 24 Months */}
                      <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                        <label className="block text-xs font-bold text-white mb-2">
                          Tarification en Euros (€) · Durées Officielles 12 et 24 Mois :
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-[11px] text-slate-400 block mb-1">Prix 12 Mois (1 An) *</span>
                            <input
                              type="number"
                              step="0.01"
                              required
                              value={editingProduct.pricing?.[12] ?? ''}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setEditingProduct({
                                  ...editingProduct,
                                  basePrice: val,
                                  pricing: {
                                    12: val,
                                    24: editingProduct.pricing?.[24] ?? Math.round(val * 1.7 * 100) / 100
                                  },
                                  availableDurations: [12, 24]
                                });
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-white"
                            />
                          </div>

                          <div>
                            <span className="text-[11px] text-slate-400 block mb-1">Prix 24 Mois (2 Ans) *</span>
                            <input
                              type="number"
                              step="0.01"
                              required
                              value={editingProduct.pricing?.[24] ?? ''}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setEditingProduct({
                                  ...editingProduct,
                                  pricing: {
                                    12: editingProduct.pricing?.[12] ?? editingProduct.basePrice ?? 89.99,
                                    24: val
                                  },
                                  availableDurations: [12, 24]
                                });
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1 font-semibold">Image URL ou Preset</label>
                          <input
                            type="text"
                            value={editingProduct.imageUrl || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1 font-semibold">Lien de Paiement Stripe Direct (Optionnel)</label>
                          <input
                            type="url"
                            placeholder="https://buy.stripe.com/..."
                            value={editingProduct.stripePaymentLink || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, stripePaymentLink: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
                          />
                        </div>
                      </div>

                      {/* Toggles */}
                      <div className="flex flex-wrap items-center gap-6 pt-2">
                        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingProduct.active !== false}
                            onChange={(e) => setEditingProduct({ ...editingProduct, active: e.target.checked })}
                            className="rounded bg-slate-800"
                          />
                          <span>Activer ce produit en boutique</span>
                        </label>

                        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(editingProduct.isBestSeller)}
                            onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                            className="rounded bg-slate-800"
                          />
                          <span>Badge Meilleure Vente</span>
                        </label>

                        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(editingProduct.featured)}
                            onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                            className="rounded bg-slate-800"
                          />
                          <span>Sélection en page d'accueil</span>
                        </label>
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          disabled={isSavingProduct}
                          className="px-5 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-slate-200 flex items-center gap-1.5 shadow-md"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{isSavingProduct ? 'Sauvegarde...' : 'Enregistrer le Produit'}</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Complete Products Data Table */}
                  <div className="rounded-2xl border border-white/10 overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-900/90 border-b border-white/10 text-slate-400">
                          <th className="p-3.5 font-semibold">Produit</th>
                          <th className="p-3.5 font-semibold">Catégorie</th>
                          <th className="p-3.5 font-semibold">Tarif 12M / 24M</th>
                          <th className="p-3.5 font-semibold">Lien Stripe</th>
                          <th className="p-3.5 font-semibold">Statut</th>
                          <th className="p-3.5 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.06] bg-black/40">
                        {filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-white/[0.02]">
                            <td className="p-3.5 flex items-center gap-3">
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-11 h-11 rounded-lg object-cover bg-slate-950 shrink-0 border border-white/10"
                              />
                              <div>
                                <span className="font-bold text-white block">{p.name}</span>
                                <span className="text-[10px] text-slate-500 font-mono">{p.id}</span>
                              </div>
                            </td>

                            <td className="p-3.5 text-slate-300 capitalize">
                              {p.category}
                            </td>

                            <td className="p-3.5 font-mono text-slate-200">
                              <span className="text-white font-bold">{p.pricing?.[12]?.toFixed(2) || p.basePrice.toFixed(2)} €</span>
                              <span className="text-slate-500"> / </span>
                              <span className="text-cyan-400 font-bold">{p.pricing?.[24]?.toFixed(2) || '—'} €</span>
                            </td>

                            <td className="p-3.5 text-slate-400">
                              {p.stripePaymentLink ? (
                                <a href={p.stripePaymentLink} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold">
                                  <span>Lien Actif</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-slate-600">Checkout API</span>
                              )}
                            </td>

                            <td className="p-3.5">
                              <button
                                onClick={() => handleToggleProductActive(p)}
                                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                                  p.active !== false
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-slate-800 text-slate-500'
                                }`}
                              >
                                {p.active !== false ? 'Actif en ligne' : 'Désactivé'}
                              </button>
                            </td>

                            <td className="p-3.5 text-right space-x-2">
                              <button
                                onClick={() => handleDuplicateProduct(p)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                                title="Dupliquer"
                              >
                                <Layers className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                                title="Modifier"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* ================= TAB 3: ORDERS & CRM TABLE ================= */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  
                  {/* Filters & Export Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="relative w-full sm:w-64">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Réf commande, email client..."
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300 focus:outline-none"
                      >
                        <option value="all">Tous les statuts</option>
                        <option value="paid">Payées</option>
                        <option value="delivered">Livrées</option>
                        <option value="pending">En attente</option>
                        <option value="refunded">Remboursées</option>
                      </select>
                    </div>

                    <button
                      onClick={handleExportCSV}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-white/10"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Exporter en CSV</span>
                    </button>
                  </div>

                  {/* Orders Table */}
                  <div className="rounded-2xl border border-white/10 overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-900/90 border-b border-white/10 text-slate-400">
                          <th className="p-3.5 font-semibold">Réf & Date</th>
                          <th className="p-3.5 font-semibold">Client</th>
                          <th className="p-3.5 font-semibold">Articles & Durée</th>
                          <th className="p-3.5 font-semibold">Montant</th>
                          <th className="p-3.5 font-semibold">Statut Paiement</th>
                          <th className="p-3.5 font-semibold">Statut Livraison</th>
                          <th className="p-3.5 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.06] bg-black/40">
                        {filteredOrders.map((o) => (
                          <tr key={o.id} className="hover:bg-white/[0.02]">
                            
                            {/* Ref & Date */}
                            <td className="p-3.5 font-mono">
                              <span 
                                onClick={() => setInspectingOrder(o)}
                                className="text-cyan-400 font-bold hover:underline cursor-pointer block"
                              >
                                {o.id}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {new Date(o.createdAt).toLocaleDateString('fr-FR')} {new Date(o.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </td>

                            {/* Customer */}
                            <td className="p-3.5">
                              <span className="text-white font-bold block">{o.customerName}</span>
                              <span className="text-slate-400 text-[11px] block">{o.customerEmail}</span>
                              {o.customerPhone && (
                                <span className="text-slate-500 text-[10px] font-mono">{o.customerPhone}</span>
                              )}
                            </td>

                            {/* Items */}
                            <td className="p-3.5 text-slate-300">
                              {o.items.map((it, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 truncate max-w-[200px]">
                                  <span>{it.productName}</span>
                                  <span className="px-1.5 py-0.2 rounded bg-white/10 text-cyan-300 font-bold text-[10px]">
                                    {it.duration}M
                                  </span>
                                </div>
                              ))}
                            </td>

                            {/* Total Amount */}
                            <td className="p-3.5 font-mono text-white font-bold">
                              {o.totalAmount.toFixed(2)} €
                            </td>

                            {/* Payment Status Dropdown */}
                            <td className="p-3.5">
                              <select
                                value={o.paymentStatus}
                                onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-900 border border-white/10 text-emerald-400 cursor-pointer focus:outline-none"
                              >
                                <option value="paid">Payé (Stripe)</option>
                                <option value="pending">En attente</option>
                                <option value="refunded">Remboursé</option>
                                <option value="failed">Échoué</option>
                              </select>
                            </td>

                            {/* Delivery Status Dropdown */}
                            <td className="p-3.5">
                              <select
                                value={o.deliveryStatus}
                                onChange={(e) => handleUpdateOrderStatus(o.id, undefined, e.target.value)}
                                className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-900 border border-white/10 text-cyan-300 cursor-pointer focus:outline-none"
                              >
                                <option value="delivered">Livré</option>
                                <option value="processing">En cours</option>
                                <option value="pending_verification">À vérifier</option>
                              </select>
                            </td>

                            {/* Quick Action buttons */}
                            <td className="p-3.5 text-right space-x-2">
                              <button
                                onClick={() => setInspectingOrder(o)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                                title="Voir les identifiants générés"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleResendCredentials(o)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400"
                                title="Renvoyer l'e-mail de confirmation"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </button>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* ================= TAB 4: STORE SETTINGS ================= */}
              {activeTab === 'settings' && storeSettings && (
                <div className="max-w-2xl mx-auto p-6 rounded-2xl titanium-card space-y-6">
                  <div>
                    <h4 className="text-base font-bold text-white">Paramètres Généraux de la Boutique</h4>
                    <p className="text-xs text-slate-400">Configurez les informations d'affichage et l'intégration des paiements</p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Nom de la Marque</label>
                      <input
                        type="text"
                        value={storeSettings.storeName || ''}
                        onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Slogan officiel</label>
                      <input
                        type="text"
                        value={storeSettings.slogan || ''}
                        onChange={(e) => setStoreSettings({ ...storeSettings, slogan: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">E-mail de support client</label>
                      <input
                        type="email"
                        value={storeSettings.supportEmail || ''}
                        onChange={(e) => setStoreSettings({ ...storeSettings, supportEmail: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Message d'annonce en haut de page</label>
                      <input
                        type="text"
                        value={storeSettings.announcement || ''}
                        onChange={(e) => setStoreSettings({ ...storeSettings, announcement: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Statut Passerelle Stripe</label>
                      <input
                        type="text"
                        disabled
                        value={storeSettings.stripeMode || 'Stripe Checkout API & Liens Directs Activés'}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-emerald-400 font-mono"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold text-xs transition-all shadow-md"
                      >
                        Sauvegarder les Paramètres
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* ================= ORDER INSPECTOR MODAL ================= */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80" onClick={() => setInspectingOrder(null)} />
          <div className="relative w-full max-w-lg rounded-2xl titanium-card bg-[#0b0f1d] border border-cyan-500/40 p-6 z-10 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="font-mono text-cyan-400 font-bold text-sm">
                Détails Commande : {inspectingOrder.id}
              </span>
              <button onClick={() => setInspectingOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Client :</span>
                <span className="text-white font-bold">{inspectingOrder.customerName} ({inspectingOrder.customerEmail})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date :</span>
                <span className="text-slate-300 font-mono">{new Date(inspectingOrder.createdAt).toLocaleString('fr-FR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Montant :</span>
                <span className="text-white font-bold font-mono text-sm">{inspectingOrder.totalAmount.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Stripe Payment Intent :</span>
                <span className="text-slate-400 font-mono text-[10px]">{inspectingOrder.paymentIntentId}</span>
              </div>
            </div>

            {/* Generated Credentials Delivery box */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
              <span className="text-xs font-bold text-amber-400 block uppercase">
                Identifiants délivrés au client
              </span>

              {inspectingOrder.items.map((it, idx) => (
                <div key={idx} className="space-y-2 text-xs border-t border-white/[0.06] pt-2">
                  <div className="font-bold text-white">{it.productName} ({it.duration} Mois)</div>
                  {it.deliveryDetails?.licenseKey && (
                    <div className="font-mono text-emerald-400 bg-slate-900 p-2 rounded">
                      Clé: {it.deliveryDetails.licenseKey}
                    </div>
                  )}
                  {it.deliveryDetails?.username && (
                    <div className="font-mono text-slate-300 space-y-1 bg-slate-900 p-2 rounded text-[11px]">
                      <div>User: <span className="text-white font-bold">{it.deliveryDetails.username}</span></div>
                      <div>Pass: <span className="text-amber-400 font-bold">{it.deliveryDetails.password}</span></div>
                      <div>Serveur: {it.deliveryDetails.serverUrl}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => handleResendCredentials(inspectingOrder)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Renvoyer l'e-mail</span>
              </button>
              <button
                onClick={() => setInspectingOrder(null)}
                className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
