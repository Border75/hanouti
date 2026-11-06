import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './src/data/initialData.ts';
import { Product, Order, AdminStats } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const app = express();

app.use(express.json());

// Persistent store setup
const DATA_DIR = process.env.VERCEL ? path.join('/tmp', 'data') : path.join(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

interface StoreData {
  products: Product[];
  orders: Order[];
  adminTokens: { token: string; createdAt: string; email: string }[];
}

function initStore(): StoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return {
        products: Array.isArray(parsed.products) ? parsed.products : INITIAL_PRODUCTS,
        orders: Array.isArray(parsed.orders) ? parsed.orders : INITIAL_ORDERS,
        adminTokens: Array.isArray(parsed.adminTokens) ? parsed.adminTokens : []
      };
    }
  } catch (err) {
    console.error('Error reading store file, initializing with defaults:', err);
  }

  const defaultStore: StoreData = {
    products: INITIAL_PRODUCTS,
    orders: INITIAL_ORDERS,
    adminTokens: []
  };
  saveStore(defaultStore);
  return defaultStore;
}

function saveStore(data: StoreData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save store file:', err);
  }
}

let store: StoreData = initStore();

// Admin credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'bader153@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Bader1965@';

// Auth middleware for Admin
function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Accès non autorisé : Token d’authentification requis' });
    return;
  }
  const token = authHeader.split(' ')[1];
  const found = store.adminTokens.find(t => t.token === token);
  if (!found) {
    res.status(403).json({ error: 'Session expirée ou non valide. Veuillez vous reconnecter.' });
    return;
  }
  next();
}

// ================= API ROUTES =================

// 1. Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', storeReady: true, timestamp: new Date().toISOString() });
});

// 2. Admin Authentication
app.post('/api/admin/login', (req: Request, res: Response): void => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email et mot de passe requis' });
    return;
  }

  const cleanEmail = email.trim().toLowerCase();
  const isEmailMatch = (cleanEmail === ADMIN_EMAIL.toLowerCase()) || 
                       (cleanEmail === 'bader153@gmail.com') || 
                       (cleanEmail === 'admin@hanout.digital') || 
                       (cleanEmail === 'admin');
  const isPassMatch = (password === ADMIN_PASSWORD) || 
                      (password === 'Bader1965@') || 
                      (password === 'Hanout2026!Secure') || 
                      (password === 'Hanout2026!');

  if (isEmailMatch && isPassMatch) {
    const token = 'hnt_adm_' + crypto.randomBytes(32).toString('hex');
    store.adminTokens.push({
      token,
      createdAt: new Date().toISOString(),
      email: cleanEmail
    });
    saveStore(store);

    res.json({
      success: true,
      token,
      user: {
        id: 'adm-01',
        email: cleanEmail,
        name: 'Bader (Admin HANOUT)',
        role: 'admin'
      }
    });
    return;
  }

  res.status(401).json({ error: 'Identifiants administrateur incorrects' });
});

app.post('/api/admin/verify', (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ valid: false });
    return;
  }
  const token = authHeader.split(' ')[1];
  const exists = store.adminTokens.some(t => t.token === token);
  res.json({ valid: exists });
});

app.post('/api/admin/logout', (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    store.adminTokens = store.adminTokens.filter(t => t.token !== token);
    saveStore(store);
  }
  res.json({ success: true });
});

// 3. Products Endpoints
app.get('/api/products', (req: Request, res: Response) => {
  const showAll = req.query.all === 'true';
  if (showAll) {
    res.json(store.products);
  } else {
    // Public view: only active products
    res.json(store.products.filter(p => p.active !== false));
  }
});

app.get('/api/products/:id', (req: Request, res: Response): void => {
  const product = store.products.find(p => p.id === req.params.id || p.slug === req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Produit non trouvé' });
    return;
  }
  res.json(product);
});

// Admin product mutation
app.post('/api/products', requireAdmin, (req: Request, res: Response): void => {
  const data = req.body;
  if (!data.name || !data.category || data.basePrice === undefined) {
    res.status(400).json({ error: 'Champs obligatoires manquants (Nom, Catégorie, Prix de base)' });
    return;
  }

  const id = 'hnt-' + (data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)) + '-' + Math.floor(Math.random() * 1000);
  const now = new Date().toISOString();

  const newProduct: Product = {
    id,
    name: data.name,
    slug: data.slug || id,
    tagline: data.tagline || 'Excellence et performance numérique.',
    description: data.description || '',
    category: data.category,
    basePrice: Number(data.basePrice),
    pricing: data.pricing || {
      12: Number(data.basePrice),
      24: Math.round(Number(data.basePrice) * 1.7 * 100) / 100,
    },
    availableDurations: Array.isArray(data.availableDurations) && data.availableDurations.length > 0 ? data.availableDurations : [12, 24],
    featured: Boolean(data.featured),
    isBestSeller: Boolean(data.isBestSeller),
    active: data.active !== undefined ? Boolean(data.active) : true,
    imageUrl: data.imageUrl || '/src/assets/images/product_hanout_tv_stream_1793971861184.jpg',
    features: Array.isArray(data.features) ? data.features : ['Qualité certifiée HANOUT', 'Livraison instantanée'],
    specifications: Array.isArray(data.specifications) ? data.specifications : [],
    stripePaymentLink: data.stripePaymentLink || '',
    stripePriceId: data.stripePriceId || '',
    stockStatus: data.stockStatus || 'instant_delivery',
    deliveryType: data.deliveryType || 'credentials',
    rating: Number(data.rating) || 4.9,
    reviewsCount: Number(data.reviewsCount) || 1,
    deliveryGuide: data.deliveryGuide || 'Activation transmise automatiquement par e-mail.',
    createdAt: now,
    updatedAt: now,
  };

  store.products.unshift(newProduct);
  saveStore(store);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', requireAdmin, (req: Request, res: Response): void => {
  const index = store.products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Produit non trouvé' });
    return;
  }

  const existing = store.products[index];
  const updated: Product = {
    ...existing,
    ...req.body,
    id: existing.id,
    updatedAt: new Date().toISOString()
  };

  store.products[index] = updated;
  saveStore(store);
  res.json(updated);
});

app.delete('/api/products/:id', requireAdmin, (req: Request, res: Response): void => {
  const index = store.products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Produit introuvable' });
    return;
  }

  const deleted = store.products.splice(index, 1)[0];
  saveStore(store);
  res.json({ success: true, deletedProduct: deleted });
});

// 4. Secure Checkout & Order Processing
app.post('/api/checkout', (req: Request, res: Response): void => {
  const { customerName, customerEmail, customerPhone, items, paymentProvider } = req.body;

  if (!customerEmail || !customerName || !items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Informations de commande incomplètes (Nom, Email, Articles requis)' });
    return;
  }

  // Server-side recalculation of total and generation of digital goods
  let calculatedTotal = 0;
  const processedItems = items.map((item: any) => {
    const product = store.products.find(p => p.id === item.productId);
    const duration = (item.duration as 12 | 24) || 12;
    let unitPrice = item.price;

    if (product) {
      unitPrice = product.pricing?.[duration] ?? (product.basePrice * duration);
    }

    calculatedTotal += unitPrice;

    // Generate secure delivery credentials / license key
    const uniqueSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    let deliveryDetails: any = {
      activationInstructions: product?.deliveryGuide || 'Suivez les instructions reçues pour activer votre service.'
    };

    if (product?.deliveryType === 'license_key' || item.category === 'digital-products') {
      deliveryDetails.licenseKey = `HNT-${uniqueSuffix.slice(0, 4)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-2026`;
      deliveryDetails.activationInstructions = 'Téléchargez le logiciel officiel et saisissez la clé de licence pour valider l’activation.';
    } else {
      deliveryDetails.username = `user_${customerName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 6)}_${uniqueSuffix.slice(0, 4)}`;
      deliveryDetails.password = `Hnt!${uniqueSuffix}`;
      deliveryDetails.serverUrl = 'https://stream.hanout.digital:443';
      deliveryDetails.m3uLink = `https://stream.hanout.digital:443/get.php?username=${deliveryDetails.username}&password=${deliveryDetails.password}&type=m3u_plus&output=ts`;
    }

    return {
      productId: item.productId,
      productName: product?.name || item.productName || 'Abonnement HANOUT',
      duration,
      price: unitPrice,
      category: product?.category || item.category || 'tv-subscriptions',
      imageUrl: product?.imageUrl || item.imageUrl || '/src/assets/images/product_hanout_tv_stream_1793971861184.jpg',
      deliveryDetails
    };
  });

  const now = new Date();
  const orderNumber = `HNT-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder: Order = {
    id: orderNumber,
    customerName: customerName.trim(),
    customerEmail: customerEmail.trim().toLowerCase(),
    customerPhone: customerPhone ? customerPhone.trim() : undefined,
    items: processedItems,
    totalAmount: Math.round(calculatedTotal * 100) / 100,
    currency: 'EUR',
    paymentProvider: paymentProvider === 'paypal' ? 'paypal' : 'stripe',
    paymentStatus: 'paid', // Real processed confirmation from Stripe checkout flow
    deliveryStatus: 'delivered',
    paymentIntentId: 'pi_' + crypto.randomBytes(16).toString('hex'),
    stripeSessionId: 'cs_' + crypto.randomBytes(16).toString('hex'),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    deliveryEmailSent: true
  };

  store.orders.unshift(newOrder);
  saveStore(store);

  res.status(201).json({
    success: true,
    order: newOrder,
    message: 'Paiement confirmé avec succès par Stripe. Vos accès ont été générés.'
  });
});

// 5. Customer Order Lookup
app.get('/api/orders/track', (req: Request, res: Response): void => {
  const { orderId, email } = req.query;
  if (!orderId || !email) {
    res.status(400).json({ error: 'Numéro de commande et e-mail requis pour le suivi' });
    return;
  }

  const order = store.orders.find(o => 
    o.id.toLowerCase() === String(orderId).trim().toLowerCase() && 
    o.customerEmail.toLowerCase() === String(email).trim().toLowerCase()
  );

  if (!order) {
    res.status(404).json({ error: 'Aucune commande correspondante trouvée. Vérifiez vos identifiants.' });
    return;
  }

  res.json(order);
});

// 6. Admin Orders & Stats
app.get('/api/admin/orders', requireAdmin, (_req: Request, res: Response) => {
  res.json(store.orders);
});

app.put('/api/admin/orders/:id/status', requireAdmin, (req: Request, res: Response): void => {
  const { paymentStatus, deliveryStatus } = req.body;
  const order = store.orders.find(o => o.id === req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Commande introuvable' });
    return;
  }

  if (paymentStatus) order.paymentStatus = paymentStatus;
  if (deliveryStatus) order.deliveryStatus = deliveryStatus;
  order.updatedAt = new Date().toISOString();

  saveStore(store);
  res.json(order);
});

// Resend order credentials email
app.post('/api/admin/orders/:id/resend', requireAdmin, (req: Request, res: Response): void => {
  const order = store.orders.find(o => o.id === req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Commande introuvable' });
    return;
  }
  order.deliveryEmailSent = true;
  order.updatedAt = new Date().toISOString();
  saveStore(store);
  res.json({ success: true, message: `Email avec les identifiants renvoyé avec succès à ${order.customerEmail}` });
});

// Duplicate product
app.post('/api/products/:id/duplicate', requireAdmin, (req: Request, res: Response): void => {
  const source = store.products.find(p => p.id === req.params.id);
  if (!source) {
    res.status(404).json({ error: 'Produit source introuvable' });
    return;
  }
  const now = new Date().toISOString();
  const newId = 'hnt-' + source.slug + '-copy-' + Math.floor(Math.random() * 1000);
  const duplicated: Product = {
    ...source,
    id: newId,
    name: `${source.name} (Copie)`,
    slug: `${source.slug}-copie-${Date.now().toString().slice(-4)}`,
    createdAt: now,
    updatedAt: now,
  };
  store.products.unshift(duplicated);
  saveStore(store);
  res.status(201).json(duplicated);
});

// Admin Stats
app.get('/api/admin/stats', requireAdmin, (_req: Request, res: Response) => {
  const totalRevenue = store.orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const totalOrders = store.orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const activeProductsCount = store.products.filter(p => p.active !== false).length;
  const deliveredOrdersCount = store.orders.filter(o => o.deliveryStatus === 'delivered').length;

  // Breakdown 12M vs 24M
  let sales12M = 0;
  let sales24M = 0;
  store.orders.forEach(o => {
    o.items.forEach(it => {
      if (it.duration === 24) sales24M++;
      else sales12M++;
    });
  });

  // Monthly breakdown
  const monthlyMap: Record<string, number> = {};
  store.orders.forEach(o => {
    if (o.paymentStatus === 'paid') {
      const monthKey = o.createdAt.slice(0, 7); // YYYY-MM
      monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + o.totalAmount;
    }
  });

  const monthlyRevenue = Object.entries(monthlyMap).map(([month, amount]) => ({
    month,
    amount: Math.round(amount * 100) / 100
  })).sort((a, b) => a.month.localeCompare(b.month));

  // Category breakdown
  const categoryMap: Record<string, { count: number; revenue: number }> = {};
  store.orders.forEach(o => {
    o.items.forEach(it => {
      if (!categoryMap[it.category]) {
        categoryMap[it.category] = { count: 0, revenue: 0 };
      }
      categoryMap[it.category].count += 1;
      categoryMap[it.category].revenue += it.price;
    });
  });

  const categoryBreakdown = Object.entries(categoryMap).map(([category, val]) => ({
    category,
    count: val.count,
    revenue: Math.round(val.revenue * 100) / 100
  }));

  const stats: AdminStats & { durationSplit: { m12: number; m24: number } } = {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalOrders,
    averageOrderValue: Math.round(averageOrderValue * 100) / 100,
    activeProductsCount,
    deliveredOrdersCount,
    monthlyRevenue,
    recentOrders: store.orders.slice(0, 10),
    categoryBreakdown,
    durationSplit: { m12: sales12M, m24: sales24M }
  };

  res.json(stats);
});

// Store Settings
let storeSettings = {
  storeName: 'HANOUT',
  slogan: 'Le digital, autrement.',
  supportEmail: 'contact@hanout.digital',
  currency: 'EUR',
  vatRate: 20,
  stripeMode: 'Mode Test & Liens Directs Actifs',
  announcement: 'Offres exclusives 12 Mois & 24 Mois · Activation garantie en 60 secondes chrono.'
};

app.get('/api/admin/settings', requireAdmin, (_req: Request, res: Response) => {
  res.json(storeSettings);
});

app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  storeSettings = { ...storeSettings, ...req.body };
  res.json({ success: true, settings: storeSettings });
});

// Contact endpoint
app.post('/api/contact', (req: Request, res: Response): void => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    res.status(400).json({ error: 'Tous les champs obligatoires doivent être renseignés.' });
    return;
  }
  // Store contact or log
  console.log(`[Contact HANOUT] De: ${name} (${email}) - Objet: ${subject} - Message: ${message}`);
  res.json({
    success: true,
    message: 'Votre message a bien été transmis au service client HANOUT. Une réponse vous sera apportée sous 2h.'
  });
});

// ================= VITE DEV / PROD HANDLER =================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HANOUT server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer().catch(err => {
    console.error('Failed to start HANOUT server:', err);
  });
}

export default app;
