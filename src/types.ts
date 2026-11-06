export type DurationOption = 12 | 24;

export type ProductCategory = 
  | 'tv-subscriptions' 
  | 'digital-services' 
  | 'premium-subscriptions' 
  | 'digital-products';

export interface CategoryInfo {
  id: ProductCategory;
  label: string;
  description: string;
  iconName: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: ProductCategory;
  basePrice: number; // Prix pour 1 mois ou prix de base en €
  pricing: Record<DurationOption, number>;
  availableDurations: DurationOption[];
  featured: boolean;
  isBestSeller: boolean;
  active: boolean;
  imageUrl: string;
  features: string[];
  specifications: ProductSpecification[];
  stripePaymentLink?: string;
  stripePriceId?: string;
  stockStatus: 'in_stock' | 'instant_delivery' | 'limited';
  deliveryType: 'instant_email' | 'credentials' | 'license_key';
  rating: number;
  reviewsCount: number;
  deliveryGuide?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryDetails {
  licenseKey?: string;
  username?: string;
  password?: string;
  serverUrl?: string;
  m3uLink?: string;
  portalUrl?: string;
  activationInstructions: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  duration: DurationOption;
  price: number;
  category: ProductCategory;
  imageUrl: string;
  deliveryDetails?: DeliveryDetails;
}

export interface Order {
  id: string; // e.g. HNT-2026-4819
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  currency: 'EUR';
  paymentProvider: 'stripe' | 'paypal';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  deliveryStatus: 'delivered' | 'processing' | 'pending_verification';
  paymentIntentId: string;
  stripeSessionId?: string;
  createdAt: string;
  updatedAt: string;
  deliveryEmailSent: boolean;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  activeProductsCount: number;
  deliveredOrdersCount: number;
  monthlyRevenue: { month: string; amount: number }[];
  recentOrders: Order[];
  categoryBreakdown: { category: string; count: number; revenue: number }[];
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}
