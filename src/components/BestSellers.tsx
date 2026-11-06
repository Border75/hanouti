import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import { Product } from '../types.ts';
import { ProductCard } from './ProductCard.tsx';

interface BestSellersProps {
  products: Product[];
  onOpenDetail: (product: Product) => void;
  onExploreAll: () => void;
}

export const BestSellers: React.FC<BestSellersProps> = ({
  products,
  onOpenDetail,
  onExploreAll
}) => {
  const bestSellers = products.filter(p => p.isBestSeller || p.featured).slice(0, 3);

  if (bestSellers.length === 0) return null;

  return (
    <section className="py-16 md:py-24 relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>Plébiscités par nos clients</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Les Meilleures Ventes HANOUT
            </h2>
            <p className="text-sm text-zinc-400 mt-2 max-w-xl">
              Découvrez nos services les plus populaires, réputés pour leur stabilité de flux exceptionnelle et leur activation sans attente.
            </p>
          </div>

          <button
            onClick={onExploreAll}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-300 hover:text-white transition-colors group shrink-0"
          >
            <span>Explorer tout le catalogue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3-Column Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetail={onOpenDetail}
              featuredHighlight={product.isBestSeller}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
