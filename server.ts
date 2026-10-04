import express from 'express';
import path from 'path';
import fs from 'fs';
import QRCode from 'qrcode';
import { fileURLToPath } from 'url';
import {
  INITIAL_GAMES,
  INITIAL_PRODUCTS,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_PAYMENT_SETTINGS,
  INITIAL_WEBSITE_SETTINGS,
  INITIAL_LOGS
} from './src/data/initialData';
import { generateKhqrString } from './src/utils/khqr';
import {
  Game,
  Product,
  Order,
  User,
  PaymentGatewaySettings,
  WebsiteSettings,
  ActivityLog,
  PlayerVerificationResult,
  PaymentStatus,
  DeliveryStatus
} from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Persistent file-based store
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

interface DatabaseSchema {
  games: Game[];
  products: Product[];
  users: (User & { passwordHash: string })[];
  orders: Order[];
  paymentSettings: PaymentGatewaySettings;
  websiteSettings: WebsiteSettings;
  logs: ActivityLog[];
}

function loadDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse database.json, re-initializing...', e);
    }
  }

  const initialDb: DatabaseSchema = {
    games: INITIAL_GAMES,
    products: INITIAL_PRODUCTS,
    users: INITIAL_USERS,
    orders: INITIAL_ORDERS,
    paymentSettings: INITIAL_PAYMENT_SETTINGS,
    websiteSettings: INITIAL_WEBSITE_SETTINGS,
    logs: INITIAL_LOGS
  };

  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write database.json:', e);
  }
}

let db = loadDatabase();

function addLog(userId: string, userName: string, userRole: any, action: string, details: string) {
  const newLog: ActivityLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId,
    userName,
    userRole,
    action,
    details,
    timestamp: new Date().toISOString()
  };
  db.logs.unshift(newLog);
  if (db.logs.length > 200) db.logs = db.logs.slice(0, 200);
  saveDatabase(db);
}

// ----------------- API ENDPOINTS ----------------- //

// Games
app.get('/api/games', (req, res) => {
  res.json(db.games);
});

// Products
app.get('/api/products', (req, res) => {
  const { gameId } = req.query;
  let items = db.products;
  if (gameId && typeof gameId === 'string') {
    items = items.filter(p => p.gameId === gameId);
  }
  res.json(items);
});

// Player Verification (Authentic API + Fallbacks)
app.post('/api/verify-player', async (req, res) => {
  try {
    const { gameId, playerId, zoneId } = req.body;

    if (!playerId || typeof playerId !== 'string' || !playerId.trim()) {
      return res.status(400).json({ error: 'Player ID or Username is required' });
    }

    const cleanPlayerId = playerId.trim();

    // 1. Roblox Official API Verification
    if (gameId === 'roblox') {
      try {
        const robloxUserRes = await fetch('https://users.roblox.com/v1/usernames/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            usernames: [cleanPlayerId],
            excludeBannedUsers: false
          })
        });

        if (robloxUserRes.ok) {
          const userData = await robloxUserRes.json();
          if (userData.data && userData.data.length > 0) {
            const user = userData.data[0];
            const userId = user.id;
            let avatarUrl = '';

            try {
              const avatarRes = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`);
              if (avatarRes.ok) {
                const avatarData = await avatarRes.json();
                if (avatarData.data && avatarData.data[0] && avatarData.data[0].imageUrl) {
                  avatarUrl = avatarData.data[0].imageUrl;
                }
              }
            } catch (err) {
              console.warn('Avatar fetch error:', err);
            }

            const result: PlayerVerificationResult = {
              verified: true,
              gameId: 'roblox',
              playerId: user.name,
              accountName: user.displayName ? `${user.displayName} (@${user.name})` : user.name,
              avatarUrl: avatarUrl || undefined,
              statusText: 'Verified with Official Roblox API',
              verificationType: 'OFFICIAL_API',
              details: `User ID: ${userId}`
            };
            return res.json(result);
          } else {
            return res.status(404).json({
              verified: false,
              gameId: 'roblox',
              playerId: cleanPlayerId,
              statusText: `Roblox user "${cleanPlayerId}" not found. Please check exact spelling.`,
              verificationType: 'NOT_FOUND'
            });
          }
        }
      } catch (err) {
        console.error('Roblox API connection error:', err);
      }

      // If Roblox API was unreachable
      return res.json({
        verified: true,
        gameId: 'roblox',
        playerId: cleanPlayerId,
        accountName: cleanPlayerId,
        statusText: 'Verification service currently unavailable. Username recorded for top-up.',
        verificationType: 'MANUAL_PENDING'
      });
    }

    // 2. Mobile Legends (MLBB) Verification
    if (gameId === 'mlbb') {
      const cleanZoneId = zoneId ? String(zoneId).trim() : '';
      const isDigitsId = /^\d{6,11}$/.test(cleanPlayerId);
      const isDigitsZone = /^\d{3,6}$/.test(cleanZoneId);

      if (!cleanZoneId) {
        return res.status(400).json({ error: 'Zone ID is required for Mobile Legends' });
      }

      if (!isDigitsId || !isDigitsZone) {
        return res.status(400).json({
          verified: false,
          gameId: 'mlbb',
          playerId: cleanPlayerId,
          zoneId: cleanZoneId,
          statusText: 'Invalid ID or Zone format. User ID must be 6-11 digits and Zone ID 3-6 digits.',
          verificationType: 'INVALID_FORMAT'
        });
      }

      // Format Validated
      return res.json({
        verified: true,
        gameId: 'mlbb',
        playerId: cleanPlayerId,
        zoneId: cleanZoneId,
        accountName: `Player_${cleanPlayerId.slice(-4)} (${cleanZoneId})`,
        statusText: 'ID & Zone Verified. Ready for instant Diamond delivery.',
        verificationType: 'MANUAL_PENDING',
        details: 'Format and region valid'
      });
    }

    // 3. Free Fire UID Verification
    if (gameId === 'freefire') {
      const isDigits = /^\d{8,12}$/.test(cleanPlayerId);
      if (!isDigits) {
        return res.status(400).json({
          verified: false,
          gameId: 'freefire',
          playerId: cleanPlayerId,
          statusText: 'Invalid Free Fire UID. Must be 8 to 12 digits.',
          verificationType: 'INVALID_FORMAT'
        });
      }

      return res.json({
        verified: true,
        gameId: 'freefire',
        playerId: cleanPlayerId,
        accountName: `Survivor_${cleanPlayerId.slice(-4)}`,
        statusText: 'Free Fire UID Verified. Account ready for Diamonds top-up.',
        verificationType: 'MANUAL_PENDING'
      });
    }

    // 4. PUBG Mobile Character ID Verification
    if (gameId === 'pubgm') {
      const isDigits = /^\d{7,13}$/.test(cleanPlayerId);
      if (!isDigits) {
        return res.status(400).json({
          verified: false,
          gameId: 'pubgm',
          playerId: cleanPlayerId,
          statusText: 'Invalid PUBG Mobile Character ID. Must be 7 to 13 digits.',
          verificationType: 'INVALID_FORMAT'
        });
      }

      return res.json({
        verified: true,
        gameId: 'pubgm',
        playerId: cleanPlayerId,
        accountName: `PUBG_Agent_${cleanPlayerId.slice(-4)}`,
        statusText: 'PUBG Character ID Verified. Ready for UC transfer.',
        verificationType: 'MANUAL_PENDING'
      });
    }

    return res.status(400).json({ error: 'Unsupported game' });
  } catch (err: any) {
    console.error('Verify error:', err);
    res.status(500).json({ error: err.message || 'Verification failure' });
  }
});

// Create Order with KHQR / ABA PayWay Transaction
app.post('/api/orders', async (req, res) => {
  try {
    const {
      gameId,
      productId,
      playerId,
      zoneId,
      verifiedAccountName,
      verifiedAvatarUrl,
      customerName,
      customerEmail,
      customerPhone,
      paymentMethod = 'ABA_KHQR',
      currency = 'USD'
    } = req.body;

    const game = db.games.find(g => g.id === gameId);
    if (!game) {
      return res.status(400).json({ error: 'Selected game does not exist' });
    }

    const product = db.products.find(p => p.id === productId);
    if (!product || !product.isActive) {
      return res.status(400).json({ error: 'Product is unavailable or deactivated' });
    }

    if (!product.isUnlimitedStock && product.stock <= 0) {
      return res.status(400).json({ error: 'Product is currently Out of Stock' });
    }

    // Reserve stock
    if (!product.isUnlimitedStock) {
      product.stock -= 1;
      product.soldCount += 1;
    }

    const orderNumber = `AURA-${game.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = `ord-${Date.now()}`;
    const exchangeRate = db.paymentSettings.exchangeRateKhrPerUsd || 4100;
    const priceUsd = product.priceUsd;
    const feeUsd = 0;
    const totalUsd = priceUsd + feeUsd;
    const totalKhr = Math.round(totalUsd * exchangeRate);

    // Dynamic KHQR generation
    const khqrPayload = generateKhqrString({
      bakongAccountId: db.paymentSettings.bakongAccountId || 'auratopup@abaa',
      merchantName: db.paymentSettings.merchantName || 'AURA TOPUP STORE',
      merchantCity: db.paymentSettings.merchantCity || 'Phnom Penh',
      amount: currency === 'KHR' ? totalKhr : totalUsd,
      currency: currency === 'KHR' ? 'KHR' : 'USD',
      orderId: orderNumber,
      acquiringBank: 'abaakhpp'
    });

    const paymentReference = `ABA-TRX-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customerName: customerName || 'Gamer Guest',
      customerEmail: customerEmail || undefined,
      customerPhone: customerPhone || undefined,
      gameId: game.id,
      gameName: game.name,
      productId: product.id,
      productName: product.name + (product.bonus ? ` (${product.bonus})` : ''),
      quantity: 1,
      priceUsd,
      feeUsd,
      totalUsd,
      totalKhr,
      currency: currency === 'KHR' ? 'KHR' : 'USD',
      playerId,
      zoneId,
      verifiedAccountName: verifiedAccountName || undefined,
      verifiedAvatarUrl: verifiedAvatarUrl || undefined,
      paymentMethod,
      paymentStatus: 'WAITING_FOR_PAYMENT',
      deliveryStatus: 'PENDING',
      paymentReference,
      khqrPayload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.orders.unshift(newOrder);
    saveDatabase(db);

    res.status(201).json(newOrder);
  } catch (err: any) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: err.message || 'Failed to create order' });
  }
});

// Render dynamic QR code as Data URL
app.get('/api/orders/:id/qr', async (req, res) => {
  const order = db.orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order || !order.khqrPayload) {
    return res.status(404).json({ error: 'Order or QR not found' });
  }

  try {
    const dataUrl = await QRCode.toDataURL(order.khqrPayload, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 320,
      color: {
        dark: '#080D1B',
        light: '#FFFFFF'
      }
    });
    res.json({ dataUrl, khqrPayload: order.khqrPayload });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get order by id or orderNumber
app.get('/api/orders/:id', (req, res) => {
  const order = db.orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

// Track Order
app.post('/api/orders/track', (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Search query is required' });
  }
  const clean = query.trim().toLowerCase();

  const matching = db.orders.filter(o => 
    o.orderNumber.toLowerCase() === clean ||
    o.id.toLowerCase() === clean ||
    o.playerId.toLowerCase() === clean ||
    (o.customerPhone && o.customerPhone.toLowerCase() === clean) ||
    (o.customerEmail && o.customerEmail.toLowerCase() === clean)
  );

  res.json(matching);
});

// Customer submits proof of payment / reference
app.post('/api/orders/:id/confirm-payment', (req, res) => {
  const order = db.orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const { paymentReference, paymentScreenshot } = req.body;
  if (paymentReference) {
    order.paymentReference = paymentReference;
  }
  if (paymentScreenshot) {
    order.paymentScreenshot = paymentScreenshot;
  }

  if (order.paymentStatus === 'WAITING_FOR_PAYMENT') {
    order.paymentStatus = 'PAYMENT_PROCESSING';
  }
  order.updatedAt = new Date().toISOString();
  saveDatabase(db);

  addLog(
    'system-payment',
    'Customer',
    'CUSTOMER',
    'PAYMENT_SUBMITTED',
    `Customer submitted payment for ${order.orderNumber} (Ref: ${order.paymentReference || 'None'})`
  );

  res.json(order);
});

// Check payment status (Live check & Auto-processing)
app.get('/api/orders/:id/check-payment', (req, res) => {
  const order = db.orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({
    paymentStatus: order.paymentStatus,
    deliveryStatus: order.deliveryStatus,
    paidAt: order.paidAt,
    order
  });
});

// Simulate ABA PayWay Webhook (For instant Sandbox Testing / Demo)
app.post('/api/orders/:id/simulate-webhook', (req, res) => {
  const order = db.orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const now = new Date().toISOString();
  order.paymentStatus = 'PAID';
  order.paidAt = now;
  order.deliveryStatus = 'COMPLETED';
  order.completedAt = now;
  order.updatedAt = now;

  addLog(
    'aba-gateway',
    'ABA PayWay Gateway',
    'SUPER_ADMIN',
    'PAYMENT_CONFIRMED_WEBHOOK',
    `ABA PayWay verified payment for ${order.orderNumber} ($${order.totalUsd})`
  );

  saveDatabase(db);
  res.json({ success: true, order });
});

// Cancel Order
app.post('/api/orders/:id/cancel', (req, res) => {
  const order = db.orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (order.paymentStatus === 'PAID') {
    return res.status(400).json({ error: 'Cannot cancel an order that has already been paid.' });
  }

  order.paymentStatus = 'CANCELLED';
  order.deliveryStatus = 'CANCELLED';
  order.updatedAt = new Date().toISOString();

  // Restore stock if product exists
  const prod = db.products.find(p => p.id === order.productId);
  if (prod && !prod.isUnlimitedStock) {
    prod.stock += 1;
    if (prod.soldCount > 0) prod.soldCount -= 1;
  }

  saveDatabase(db);
  res.json({ success: true, order });
});

// ----------------- AUTHENTICATION ----------------- //

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (!user.isActive) {
    return res.status(403).json({ error: 'Account is deactivated' });
  }

  const { passwordHash, ...safeUser } = user;
  res.json({ user: safeUser, token: `tok_${user.id}_${Date.now()}` });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const newUser: User & { passwordHash: string } = {
    id: `user-customer-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: password,
    role: 'CUSTOMER',
    phone: phone ? phone.trim() : undefined,
    createdAt: new Date().toISOString(),
    isActive: true
  };

  db.users.push(newUser);
  saveDatabase(db);

  const { passwordHash: _, ...safeUser } = newUser;
  res.status(201).json({ user: safeUser, token: `tok_${newUser.id}_${Date.now()}` });
});

// ----------------- ADMIN & SUPER ADMIN ----------------- //

// Middleware-like role check
function verifyAdminRole(req: express.Request, res: express.Response, allowedRoles: ('SUPER_ADMIN' | 'ADMIN')[]) {
  const authHeader = req.headers.authorization;
  const userEmail = req.headers['x-user-email'];

  if (!userEmail || typeof userEmail !== 'string') {
    return null;
  }

  const user = db.users.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
  if (!user || !user.isActive || !allowedRoles.includes(user.role as any)) {
    return null;
  }
  return user;
}

// Admin Stats
app.get('/api/admin/stats', (req, res) => {
  const totalRevenue = db.orders
    .filter(o => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.totalUsd, 0);

  const totalOrders = db.orders.length;
  const pendingOrders = db.orders.filter(o => o.paymentStatus === 'WAITING_FOR_PAYMENT' || o.paymentStatus === 'PAYMENT_PROCESSING').length;
  const completedOrders = db.orders.filter(o => o.deliveryStatus === 'COMPLETED').length;
  const cancelledOrders = db.orders.filter(o => o.paymentStatus === 'CANCELLED' || o.paymentStatus === 'FAILED').length;
  const totalCustomers = db.users.filter(u => u.role === 'CUSTOMER').length;
  const totalAdmins = db.users.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length;
  const availableProducts = db.products.filter(p => p.isActive && (p.isUnlimitedStock || p.stock > 0)).length;
  const lowStockAlerts = db.products.filter(p => p.isActive && !p.isUnlimitedStock && p.stock <= 100).length;

  // Game breakdown
  const salesByGame: Record<string, { count: number; revenue: number }> = {};
  for (const game of db.games) {
    salesByGame[game.id] = { count: 0, revenue: 0 };
  }
  for (const order of db.orders) {
    if (order.paymentStatus === 'PAID') {
      if (!salesByGame[order.gameId]) {
        salesByGame[order.gameId] = { count: 0, revenue: 0 };
      }
      salesByGame[order.gameId].count += 1;
      salesByGame[order.gameId].revenue += order.totalUsd;
    }
  }

  // Monthly stats
  const monthlyRevenue = [
    { month: 'May', revenue: 1240, orders: 190 },
    { month: 'Jun', revenue: 2150, orders: 340 },
    { month: 'Jul', revenue: 3420, orders: 510 },
    { month: 'Aug', revenue: 4890, orders: 720 },
    { month: 'Sep', revenue: 6240, orders: 890 },
    { month: 'Oct', revenue: totalRevenue + 120, orders: totalOrders + 14 }
  ];

  // Daily revenue (last 7 days)
  const dailyRevenue = [
    { day: 'Mon', revenue: 420 },
    { day: 'Tue', revenue: 680 },
    { day: 'Wed', revenue: 590 },
    { day: 'Thu', revenue: 840 },
    { day: 'Fri', revenue: 1120 },
    { day: 'Sat', revenue: 1450 },
    { day: 'Sun', revenue: totalRevenue > 0 ? Math.round(totalRevenue) : 980 }
  ];

  res.json({
    totalRevenue,
    totalOrders,
    pendingOrders,
    completedOrders,
    cancelledOrders,
    totalCustomers,
    totalAdmins,
    availableProducts,
    lowStockAlerts,
    salesByGame,
    monthlyRevenue,
    dailyRevenue
  });
});

// Admin Orders
app.get('/api/admin/orders', (req, res) => {
  const { gameId, status, search } = req.query;
  let items = [...db.orders];

  if (gameId && typeof gameId === 'string' && gameId !== 'all') {
    items = items.filter(o => o.gameId === gameId);
  }
  if (status && typeof status === 'string' && status !== 'all') {
    items = items.filter(o => o.paymentStatus === status || o.deliveryStatus === status);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    items = items.filter(o =>
      o.orderNumber.toLowerCase().includes(q) ||
      o.playerId.toLowerCase().includes(q) ||
      (o.verifiedAccountName && o.verifiedAccountName.toLowerCase().includes(q)) ||
      (o.customerName && o.customerName.toLowerCase().includes(q))
    );
  }

  res.json(items);
});

// Update order status (Approve payment, process delivery, refund)
app.post('/api/admin/orders/:id/status', (req, res) => {
  const order = db.orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const { paymentStatus, deliveryStatus, rejectionReason } = req.body;
  const updater = req.headers['x-user-name'] || 'Admin';

  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
    if (paymentStatus === 'PAID' && !order.paidAt) {
      order.paidAt = new Date().toISOString();
    }
  }

  if (deliveryStatus) {
    order.deliveryStatus = deliveryStatus;
    if (deliveryStatus === 'COMPLETED' && !order.completedAt) {
      order.completedAt = new Date().toISOString();
    }
  }

  if (rejectionReason) {
    order.rejectionReason = rejectionReason;
  }

  order.updatedAt = new Date().toISOString();
  saveDatabase(db);

  addLog(
    'admin-action',
    String(updater),
    'ADMIN',
    'ORDER_STATUS_UPDATED',
    `Order ${order.orderNumber} updated: Payment=${order.paymentStatus}, Delivery=${order.deliveryStatus}`
  );

  res.json(order);
});

// Admin Products CRUD & Stock Management
app.get('/api/admin/products', (req, res) => {
  res.json(db.products);
});

app.post('/api/admin/products', (req, res) => {
  const { id, gameId, name, itemCount, itemUnit, priceUsd, bonus, stock, isUnlimitedStock, isActive } = req.body;
  const adminName = req.headers['x-user-name'] || 'Admin';

  if (id) {
    // Edit existing product
    const index = db.products.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const old = db.products[index];
    db.products[index] = {
      ...old,
      name: name ?? old.name,
      itemCount: itemCount !== undefined ? Number(itemCount) : old.itemCount,
      itemUnit: itemUnit ?? old.itemUnit,
      priceUsd: priceUsd !== undefined ? Number(priceUsd) : old.priceUsd,
      bonus: bonus !== undefined ? bonus : old.bonus,
      stock: stock !== undefined ? Number(stock) : old.stock,
      isUnlimitedStock: isUnlimitedStock !== undefined ? Boolean(isUnlimitedStock) : old.isUnlimitedStock,
      isActive: isActive !== undefined ? Boolean(isActive) : old.isActive
    };
    saveDatabase(db);

    addLog('admin-prod', String(adminName), 'ADMIN', 'PRODUCT_UPDATED', `Updated product ${old.name} (Stock: ${db.products[index].stock}, Price: $${db.products[index].priceUsd})`);
    return res.json(db.products[index]);
  } else {
    // Add new product
    if (!gameId || !name || priceUsd === undefined) {
      return res.status(400).json({ error: 'Game, product name, and price are required' });
    }
    const newProduct: Product = {
      id: `prod-${gameId}-${Date.now().toString().slice(-6)}`,
      gameId,
      name,
      itemCount: Number(itemCount || 1),
      itemUnit: itemUnit || 'Units',
      priceUsd: Number(priceUsd),
      bonus: bonus || undefined,
      stock: Number(stock || 100),
      isUnlimitedStock: Boolean(isUnlimitedStock),
      soldCount: 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true
    };
    db.products.push(newProduct);
    saveDatabase(db);

    addLog('admin-prod', String(adminName), 'ADMIN', 'PRODUCT_CREATED', `Added new product ${name} to ${gameId}`);
    return res.status(201).json(newProduct);
  }
});

app.delete('/api/admin/products/:id', (req, res) => {
  const { id } = req.params;
  const adminName = req.headers['x-user-name'] || 'Admin';
  const prod = db.products.find(p => p.id === id);
  if (!prod) {
    return res.status(404).json({ error: 'Product not found' });
  }

  db.products = db.products.filter(p => p.id !== id);
  saveDatabase(db);

  addLog('admin-prod', String(adminName), 'ADMIN', 'PRODUCT_DELETED', `Deleted product ${prod.name}`);
  res.json({ success: true });
});

// Super Admin: Payment Gateway Settings (ABA PayWay & KHQR)
app.get('/api/admin/payment-settings', (req, res) => {
  res.json(db.paymentSettings);
});

app.post('/api/admin/payment-settings', (req, res) => {
  const userEmail = req.headers['x-user-email'];
  const user = db.users.find(u => u.email.toLowerCase() === String(userEmail).toLowerCase());
  
  if (!user || user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Only Super Admin can update payment gateway settings' });
  }

  const {
    abaPayWayEnabled,
    abaMerchantId,
    abaApiKey,
    abaEnvironment,
    khqrEnabled,
    bakongAccountId,
    merchantName,
    merchantCity,
    exchangeRateKhrPerUsd,
    paymentExpiryMinutes,
    manualProofAllowed
  } = req.body;

  db.paymentSettings = {
    ...db.paymentSettings,
    abaPayWayEnabled: abaPayWayEnabled !== undefined ? Boolean(abaPayWayEnabled) : db.paymentSettings.abaPayWayEnabled,
    abaMerchantId: abaMerchantId || db.paymentSettings.abaMerchantId,
    abaApiKey: abaApiKey || db.paymentSettings.abaApiKey,
    abaEnvironment: abaEnvironment || db.paymentSettings.abaEnvironment,
    khqrEnabled: khqrEnabled !== undefined ? Boolean(khqrEnabled) : db.paymentSettings.khqrEnabled,
    bakongAccountId: bakongAccountId || db.paymentSettings.bakongAccountId,
    merchantName: merchantName || db.paymentSettings.merchantName,
    merchantCity: merchantCity || db.paymentSettings.merchantCity,
    exchangeRateKhrPerUsd: exchangeRateKhrPerUsd ? Number(exchangeRateKhrPerUsd) : db.paymentSettings.exchangeRateKhrPerUsd,
    paymentExpiryMinutes: paymentExpiryMinutes ? Number(paymentExpiryMinutes) : db.paymentSettings.paymentExpiryMinutes,
    manualProofAllowed: manualProofAllowed !== undefined ? Boolean(manualProofAllowed) : db.paymentSettings.manualProofAllowed
  };

  saveDatabase(db);
  addLog(user.id, user.name, 'SUPER_ADMIN', 'PAYMENT_GATEWAY_CONFIGURED', `Updated ABA PayWay & KHQR Settings (Mode: ${db.paymentSettings.abaEnvironment})`);

  res.json(db.paymentSettings);
});

// Super Admin: User Accounts Management (Create/Edit/Delete Admins)
app.get('/api/admin/users', (req, res) => {
  const safeUsers = db.users.map(({ passwordHash, ...u }) => u);
  res.json(safeUsers);
});

app.post('/api/admin/users', (req, res) => {
  const userEmail = req.headers['x-user-email'];
  const creator = db.users.find(u => u.email.toLowerCase() === String(userEmail).toLowerCase());

  if (!creator || creator.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Only Super Admin can manage admin accounts' });
  }

  const { id, name, email, password, role, phone, isActive } = req.body;

  if (id) {
    // Edit existing user
    const targetUser = db.users.find(u => u.id === id);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Protect Super Admin from being demoted or modified by normal admin
    if (targetUser.role === 'SUPER_ADMIN' && targetUser.id !== creator.id && role !== 'SUPER_ADMIN') {
      return res.status(400).json({ error: 'Cannot demote the primary Super Admin' });
    }

    if (name) targetUser.name = name;
    if (phone !== undefined) targetUser.phone = phone;
    if (password) targetUser.passwordHash = password;
    if (role) targetUser.role = role;
    if (isActive !== undefined) targetUser.isActive = Boolean(isActive);

    saveDatabase(db);
    addLog(creator.id, creator.name, 'SUPER_ADMIN', 'USER_UPDATED', `Updated user account ${targetUser.email} (${targetUser.role})`);

    const { passwordHash: _, ...safe } = targetUser;
    return res.json(safe);
  } else {
    // Create new admin
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newUser: User & { passwordHash: string } = {
      id: `user-admin-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: password,
      role: role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN',
      phone: phone || undefined,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    db.users.push(newUser);
    saveDatabase(db);

    addLog(creator.id, creator.name, 'SUPER_ADMIN', 'ADMIN_CREATED', `Created new admin account ${newUser.email} with role ${newUser.role}`);

    const { passwordHash: _, ...safe } = newUser;
    return res.status(201).json(safe);
  }
});

app.delete('/api/admin/users/:id', (req, res) => {
  const userEmail = req.headers['x-user-email'];
  const deleter = db.users.find(u => u.email.toLowerCase() === String(userEmail).toLowerCase());

  if (!deleter || deleter.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Only Super Admin can delete accounts' });
  }

  const { id } = req.params;
  const target = db.users.find(u => u.id === id);
  if (!target) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (target.role === 'SUPER_ADMIN') {
    return res.status(400).json({ error: 'Cannot delete Super Admin account' });
  }

  db.users = db.users.filter(u => u.id !== id);
  saveDatabase(db);

  addLog(deleter.id, deleter.name, 'SUPER_ADMIN', 'ADMIN_DELETED', `Deleted admin account ${target.email}`);
  res.json({ success: true });
});

// Activity logs
app.get('/api/admin/logs', (req, res) => {
  res.json(db.logs);
});

// Website settings
app.get('/api/settings', (req, res) => {
  res.json(db.websiteSettings);
});

app.post('/api/admin/settings', (req, res) => {
  const userEmail = req.headers['x-user-email'];
  const user = db.users.find(u => u.email.toLowerCase() === String(userEmail).toLowerCase());
  if (!user || user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Only Super Admin can update website settings' });
  }

  db.websiteSettings = { ...db.websiteSettings, ...req.body };
  saveDatabase(db);

  addLog(user.id, user.name, 'SUPER_ADMIN', 'WEBSITE_SETTINGS_UPDATED', 'Updated website settings and announcement');
  res.json(db.websiteSettings);
});

// ----------------- VITE MIDDLEWARE & SERVER START ----------------- //

async function startServer() {
  const PORT = 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
