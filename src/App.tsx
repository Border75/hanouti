/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { BentoGridSection } from './components/BentoGridSection.tsx';
import { TvSubscriptionShowcase } from './components/TvSubscriptionShowcase.tsx';
import { PlanComparisonSection } from './components/PlanComparisonSection.tsx';
import { ProductCatalog } from './components/ProductCatalog.tsx';
import { AdvantagesSection } from './components/AdvantagesSection.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { OrderTrackingModal } from './components/OrderTrackingModal.tsx';
import { AdminModal } from './components/AdminModal.tsx';
import { ContactModal } from './components/ContactModal.tsx';
import { LegalModal, LegalDocType } from './components/LegalModal.tsx';
import { Footer } from './components/Footer.tsx';
import { Product } from './types.ts';
import { INITIAL_PRODUCTS } from './data/initialData.ts';

function MainStore() {
  const { selectedProductForDetail, setSelectedProductForDetail } = useCart();

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Admin state
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('hanout_admin_token');
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Client modals
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocType | null>(null);

  // Category filter state for catalog
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);

  // Load products from API
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      }
    } catch (e) {
      console.warn('Using initial products fallback:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdminLoginSuccess = (token: string) => {
    setAdminToken(token);
    localStorage.setItem('hanout_admin_token', token);
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('hanout_admin_token');
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#06080f] text-slate-100 flex flex-col font-sans selection:bg-cyan-400 selection:text-black">
      
      {/* Navbar with 3-Zone Apple Contract & Ribbon */}
      <Navbar
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenTracking={() => setIsTrackingModalOpen(true)}
        onOpenContact={() => setIsContactModalOpen(true)}
        isAdminLoggedIn={Boolean(adminToken)}
      />

      {/* Main Content Sections with Fresh High-End Layout */}
      <main className="flex-1">
        {/* 1. Hero Section with Split Interactive Plan Selector */}
        <Hero
          products={products}
          onExplore={() => scrollToSection('catalogue')}
          onExploreTV={() => scrollToSection('abonnements-tv')}
        />

        {/* 2. Bento Grid Ecosystem Showcase (New layout) */}
        <div id="bento-univers">
          <BentoGridSection
            products={products}
            onOpenDetail={(product) => setSelectedProductForDetail(product)}
          />
        </div>

        {/* 3. Dedicated TV Subscriptions 4K Showcase */}
        <TvSubscriptionShowcase
          products={products}
          onOpenDetail={(product) => setSelectedProductForDetail(product)}
        />

        {/* 4. Interactive 12M vs 24M Comparison Module (New layout) */}
        <div id="comparatif">
          <PlanComparisonSection
            products={products}
          />
        </div>

        {/* 5. Complete Dynamic Catalog Section */}
        <ProductCatalog
          products={products}
          onOpenDetail={(product) => setSelectedProductForDetail(product)}
          activeCategoryFilter={activeCategoryFilter}
          onCategoryChange={setActiveCategoryFilter}
        />

        {/* 6. Advantages & Trust Section */}
        <AdvantagesSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenLegal={(type) => setActiveLegalDoc(type)}
        onOpenContact={() => setIsContactModalOpen(true)}
        onOpenTracking={() => setIsTrackingModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Modals & Slide-Overs */}
      {/* 1. Product Detail Modal (PDP) */}
      <ProductDetailModal
        product={selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
      />

      {/* 2. Cart Drawer */}
      <CartDrawer />

      {/* 3. Secure Stripe Checkout Modal */}
      <CheckoutModal />

      {/* 4. Customer Order Tracking */}
      <OrderTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
      />

      {/* 5. Full-Featured Admin Executive Dashboard & Login Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        adminToken={adminToken}
        onLoginSuccess={handleAdminLoginSuccess}
        onLogout={handleAdminLogout}
        onProductsUpdated={fetchProducts}
      />

      {/* 6. Contact Support Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      {/* 7. Legal & FAQ Modal */}
      <LegalModal
        type={activeLegalDoc}
        onClose={() => setActiveLegalDoc(null)}
      />

    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainStore />
    </CartProvider>
  );
}
