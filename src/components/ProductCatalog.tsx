import React, { useState, useMemo } from 'react';
import { Search, Tv, ShieldCheck, Sparkles, KeyRound, Filter, SlidersHorizontal } from 'lucide-react';
import { Product, ProductCategory } from '../types.ts';
import { ProductCard } from './ProductCard.tsx';

interface ProductCatalogProps {
  products: Product[];
  onOpenDetail: (product: Product) => void;
  activeCategoryFilter?: string | null;
  onCategoryChange?: (category: string | null) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onOpenDetail,
  activeCategoryFilter: externalFilter,
  onCategoryChange
}) => {
  const [internalCategory, setInternalCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const selectedCategory = externalFilter !== undefined ? (externalFilter || 'all') : internalCategory;

  const handleCategorySelect = (catId: string) => {
    if (onCategoryChange) {
      onCategoryChange(catId === 'all' ? null : catId);
    }
    setInternalCategory(catId);
  };

  const categories = [
    { id: 'all', label: 'Tous les produits', icon: null },
    { id: 'tv-subscriptions', label: 'Abonnements TV', icon: Tv },
    { id: 'digital-services', label: 'Services numériques', icon: ShieldCheck },
    { id: 'premium-subscriptions', label: 'Abonnements premium', icon: Sparkles },
    { id: 'digital-products', label: 'Produits digitaux', icon: KeyRound },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesTag = p.tagline?.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesTag;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
      if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: featured first
      if (a.isBestSeller && !b.isBestSeller) return -1;
      if (!a.isBestSeller && b.isBestSeller) return 1;
      return 0;
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="catalogue" className="py-16 md:py-24 relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-2">
            Catalogue Officiel HANOUT
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explorez nos solutions numériques
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            Des abonnements longue durée exclusifs de 12 ou 24 mois pour une tranquillité totale et des économies maximales.
          </p>
        </div>

        {/* Controls Bar: Search & Category Tabs */}
        <div className="flex flex-col gap-5 mb-10">
          
          {/* Category Tabs (Segmented Control style) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                    isActive
                      ? 'bg-white text-black border-white shadow-md'
                      : 'bg-zinc-900/80 text-zinc-400 border-white/[0.06] hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Sort Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Rechercher un produit, service TV..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900/90 border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Trier par :</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-zinc-900/90 border border-white/[0.08] text-xs text-zinc-300 focus:outline-none focus:border-white/40 cursor-pointer"
              >
                <option value="featured">Recommandés</option>
                <option value="price-asc">Prix : croissant</option>
                <option value="price-desc">Prix : décroissant</option>
                <option value="rating">Mieux notés</option>
              </select>
            </div>
          </div>

        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetail={onOpenDetail}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-2xl bg-zinc-900/30 border border-white/[0.05]">
            <p className="text-zinc-400 text-sm">
              Aucun produit ne correspond à votre recherche « {searchQuery} ».
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                handleCategorySelect('all');
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-zinc-800 text-xs font-semibold text-white hover:bg-zinc-700 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
