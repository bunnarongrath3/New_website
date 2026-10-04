import { Game, Product, Order, User, PaymentGatewaySettings, WebsiteSettings, ActivityLog } from '../types';

export const INITIAL_GAMES: Game[] = [
  {
    id: 'mlbb',
    name: 'Mobile Legends: Bang Bang',
    publisher: 'Moonton',
    tagline: 'Instant Diamond & Pass Top-Up via ABA KHQR',
    category: 'MOBA',
    idLabel: 'User ID',
    idPlaceholder: 'e.g. 12345678',
    hasZoneId: true,
    zoneIdLabel: 'Zone ID',
    zoneIdPlaceholder: 'e.g. 1234',
    guideNote: 'To find your User ID and Zone ID, click your in-game avatar in the top-left corner. Your ID is the numbers in front, and Zone ID is inside the parentheses e.g. 12345678 (1234).',
    color: '#8B5CF6',
    popular: true
  },
  {
    id: 'freefire',
    name: 'Garena Free Fire',
    publisher: 'Garena',
    tagline: 'Fast Free Fire Diamonds & Memberships',
    category: 'Battle Royale',
    idLabel: 'Player UID',
    idPlaceholder: 'e.g. 192837465',
    hasZoneId: false,
    guideNote: 'To find your Player UID, tap your profile avatar on the top-left of the Free Fire main lobby. Your UID is listed below your nickname.',
    color: '#F97316',
    popular: true
  },
  {
    id: 'pubgm',
    name: 'PUBG Mobile',
    publisher: 'Level Infinite / Krafton',
    tagline: 'Official Unknown Cash (UC) & Royale Pass',
    category: 'Battle Royale',
    idLabel: 'Character ID (Player ID)',
    idPlaceholder: 'e.g. 5123456789',
    hasZoneId: false,
    guideNote: 'Open PUBG Mobile, go to your player profile in the top-right corner. Your Character ID is displayed prominently near your avatar.',
    color: '#EAB308',
    popular: true
  },
  {
    id: 'roblox',
    name: 'Roblox',
    publisher: 'Roblox Corporation',
    tagline: 'Instant Robux Top-Up with Official Avatar Check',
    category: 'Sandbox / Metaverse',
    idLabel: 'Roblox Username',
    idPlaceholder: 'e.g. Builderman',
    hasZoneId: false,
    guideNote: 'Enter your exact Roblox username (not display name). Our system automatically connects to the official Roblox API to verify your profile and avatar.',
    color: '#00D4FF',
    popular: true
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // Mobile Legends
  { id: 'ml-86', gameId: 'mlbb', name: '86 Diamonds', itemCount: 86, itemUnit: 'Diamonds', priceUsd: 1.40, bonus: '+8 Bonus', stock: 500, isUnlimitedStock: false, soldCount: 1420, isActive: true, isPopular: true },
  { id: 'ml-172', gameId: 'mlbb', name: '172 Diamonds', itemCount: 172, itemUnit: 'Diamonds', priceUsd: 2.75, bonus: '+16 Bonus', stock: 450, isUnlimitedStock: false, soldCount: 980, isActive: true },
  { id: 'ml-257', gameId: 'mlbb', name: '257 Diamonds', itemCount: 257, itemUnit: 'Diamonds', priceUsd: 4.10, bonus: '+25 Bonus', stock: 320, isUnlimitedStock: false, soldCount: 840, isActive: true, isPopular: true },
  { id: 'ml-344', gameId: 'mlbb', name: '344 Diamonds', itemCount: 344, itemUnit: 'Diamonds', priceUsd: 5.45, bonus: '+34 Bonus', stock: 280, isUnlimitedStock: false, soldCount: 650, isActive: true },
  { id: 'ml-514', gameId: 'mlbb', name: '514 Diamonds', itemCount: 514, itemUnit: 'Diamonds', priceUsd: 8.15, bonus: '+52 Bonus', stock: 190, isUnlimitedStock: false, soldCount: 520, isActive: true },
  { id: 'ml-706', gameId: 'mlbb', name: '706 Diamonds', itemCount: 706, itemUnit: 'Diamonds', priceUsd: 10.90, bonus: '+71 Bonus', stock: 140, isUnlimitedStock: false, soldCount: 410, isActive: true },
  { id: 'ml-878', gameId: 'mlbb', name: '878 Diamonds', itemCount: 878, itemUnit: 'Diamonds', priceUsd: 13.60, bonus: '+89 Bonus', stock: 95, isUnlimitedStock: false, soldCount: 290, isActive: true },
  { id: 'ml-1412', gameId: 'mlbb', name: '1412 Diamonds', itemCount: 1412, itemUnit: 'Diamonds', priceUsd: 21.80, bonus: '+142 Bonus', stock: 60, isUnlimitedStock: false, soldCount: 180, isActive: true },
  { id: 'ml-weekly', gameId: 'mlbb', name: 'Weekly Diamond Pass', itemCount: 1, itemUnit: 'Pass', priceUsd: 1.99, bonus: '210 Dia + 70 Starlight', stock: 1000, isUnlimitedStock: true, soldCount: 3100, isActive: true, isPopular: true },
  { id: 'ml-twilight', gameId: 'mlbb', name: 'Twilight Pass', itemCount: 1, itemUnit: 'Pass', priceUsd: 9.99, bonus: 'Exclusive Miya Skin', stock: 200, isUnlimitedStock: true, soldCount: 420, isActive: true },

  // Free Fire
  { id: 'ff-100', gameId: 'freefire', name: '100 Diamonds', itemCount: 100, itemUnit: 'Diamonds', priceUsd: 0.95, bonus: '+10 Bonus', stock: 800, isUnlimitedStock: false, soldCount: 1640, isActive: true },
  { id: 'ff-310', gameId: 'freefire', name: '310 Diamonds', itemCount: 310, itemUnit: 'Diamonds', priceUsd: 2.85, bonus: '+31 Bonus', stock: 650, isUnlimitedStock: false, soldCount: 1120, isActive: true, isPopular: true },
  { id: 'ff-520', gameId: 'freefire', name: '520 Diamonds', itemCount: 520, itemUnit: 'Diamonds', priceUsd: 4.75, bonus: '+52 Bonus', stock: 400, isUnlimitedStock: false, soldCount: 890, isActive: true },
  { id: 'ff-1060', gameId: 'freefire', name: '1060 Diamonds', itemCount: 1060, itemUnit: 'Diamonds', priceUsd: 9.50, bonus: '+106 Bonus', stock: 250, isUnlimitedStock: false, soldCount: 610, isActive: true },
  { id: 'ff-2180', gameId: 'freefire', name: '2180 Diamonds', itemCount: 2180, itemUnit: 'Diamonds', priceUsd: 19.00, bonus: '+218 Bonus', stock: 120, isUnlimitedStock: false, soldCount: 320, isActive: true },
  { id: 'ff-weekly', gameId: 'freefire', name: 'Weekly Membership', itemCount: 1, itemUnit: 'Pass', priceUsd: 1.95, bonus: '450 Dia Total', stock: 500, isUnlimitedStock: true, soldCount: 2200, isActive: true, isPopular: true },
  { id: 'ff-monthly', gameId: 'freefire', name: 'Monthly Membership', itemCount: 1, itemUnit: 'Pass', priceUsd: 7.90, bonus: '2600 Dia Total', stock: 350, isUnlimitedStock: true, soldCount: 1150, isActive: true },

  // PUBG Mobile
  { id: 'pubg-60', gameId: 'pubgm', name: '60 UC', itemCount: 60, itemUnit: 'UC', priceUsd: 0.99, stock: 900, isUnlimitedStock: false, soldCount: 1850, isActive: true },
  { id: 'pubg-325', gameId: 'pubgm', name: '325 UC', itemCount: 325, itemUnit: 'UC', priceUsd: 4.90, bonus: '+25 Bonus UC', stock: 500, isUnlimitedStock: false, soldCount: 1340, isActive: true, isPopular: true },
  { id: 'pubg-660', gameId: 'pubgm', name: '660 UC', itemCount: 660, itemUnit: 'UC', priceUsd: 9.80, bonus: '+60 Bonus UC', stock: 380, isUnlimitedStock: false, soldCount: 970, isActive: true, isPopular: true },
  { id: 'pubg-1800', gameId: 'pubgm', name: '1800 UC', itemCount: 1800, itemUnit: 'UC', priceUsd: 24.50, bonus: '+300 Bonus UC', stock: 180, isUnlimitedStock: false, soldCount: 460, isActive: true },
  { id: 'pubg-3850', gameId: 'pubgm', name: '3850 UC', itemCount: 3850, itemUnit: 'UC', priceUsd: 48.90, bonus: '+850 Bonus UC', stock: 85, isUnlimitedStock: false, soldCount: 210, isActive: true },
  { id: 'pubg-8100', gameId: 'pubgm', name: '8100 UC', itemCount: 8100, itemUnit: 'UC', priceUsd: 97.50, bonus: '+2100 Bonus UC', stock: 40, isUnlimitedStock: false, soldCount: 95, isActive: true },
  { id: 'pubg-rp', gameId: 'pubgm', name: 'Royale Pass Upgrade', itemCount: 1, itemUnit: 'Pass', priceUsd: 9.99, bonus: 'Unlock Elite Track', stock: 500, isUnlimitedStock: true, soldCount: 880, isActive: true },

  // Roblox
  { id: 'rbx-80', gameId: 'roblox', name: '80 Robux', itemCount: 80, itemUnit: 'Robux', priceUsd: 0.99, stock: 1200, isUnlimitedStock: false, soldCount: 2400, isActive: true },
  { id: 'rbx-400', gameId: 'roblox', name: '400 Robux', itemCount: 400, itemUnit: 'Robux', priceUsd: 4.85, stock: 800, isUnlimitedStock: false, soldCount: 1950, isActive: true, isPopular: true },
  { id: 'rbx-800', gameId: 'roblox', name: '800 Robux', itemCount: 800, itemUnit: 'Robux', priceUsd: 9.60, bonus: '+80 Bonus', stock: 550, isUnlimitedStock: false, soldCount: 1420, isActive: true, isPopular: true },
  { id: 'rbx-1700', gameId: 'roblox', name: '1,700 Robux', itemCount: 1700, itemUnit: 'Robux', priceUsd: 19.20, bonus: '+200 Bonus', stock: 320, isUnlimitedStock: false, soldCount: 780, isActive: true },
  { id: 'rbx-4500', gameId: 'roblox', name: '4,500 Robux', itemCount: 4500, itemUnit: 'Robux', priceUsd: 48.00, bonus: '+500 Bonus', stock: 150, isUnlimitedStock: false, soldCount: 310, isActive: true },
  { id: 'rbx-10000', gameId: 'roblox', name: '10,000 Robux', itemCount: 10000, itemUnit: 'Robux', priceUsd: 95.00, bonus: '+1500 Bonus', stock: 60, isUnlimitedStock: false, soldCount: 140, isActive: true },
  { id: 'rbx-prem-450', gameId: 'roblox', name: 'Roblox Premium 450', itemCount: 1, itemUnit: 'Sub', priceUsd: 4.99, bonus: '450 Robux/mo + 10% bonus', stock: 500, isUnlimitedStock: true, soldCount: 650, isActive: true }
];

export const INITIAL_USERS: (User & { passwordHash: string })[] = [
  {
    id: 'user-superadmin-1',
    name: 'Sokha Chan (Super Admin)',
    email: 'superadmin@auratopup.com',
    passwordHash: 'superadmin123',
    role: 'SUPER_ADMIN',
    phone: '+855 12 888 999',
    createdAt: '2026-01-15T08:00:00Z',
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80'
  },
  {
    id: 'user-admin-1',
    name: 'Dara Vannak (Support Admin)',
    email: 'admin@auratopup.com',
    passwordHash: 'admin123',
    role: 'ADMIN',
    phone: '+855 98 777 666',
    createdAt: '2026-02-01T09:30:00Z',
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80'
  },
  {
    id: 'user-customer-1',
    name: 'Rithy Seng',
    email: 'gamer@auratopup.com',
    passwordHash: 'gamer123',
    role: 'CUSTOMER',
    phone: '+855 70 333 444',
    createdAt: '2026-02-10T14:20:00Z',
    isActive: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'AURA-MLBB-9281',
    customerName: 'Rithy Seng',
    customerEmail: 'gamer@auratopup.com',
    customerPhone: '070333444',
    gameId: 'mlbb',
    gameName: 'Mobile Legends: Bang Bang',
    productId: 'ml-257',
    productName: '257 Diamonds (+25 Bonus)',
    quantity: 1,
    priceUsd: 4.10,
    feeUsd: 0.00,
    totalUsd: 4.10,
    totalKhr: 16810,
    currency: 'USD',
    playerId: '82918274',
    zoneId: '2104',
    verifiedAccountName: 'ShadowKing_KH',
    paymentMethod: 'ABA_KHQR',
    paymentStatus: 'PAID',
    deliveryStatus: 'COMPLETED',
    paymentReference: 'ABA-REF-992104',
    createdAt: '2026-10-02T14:30:00Z',
    updatedAt: '2026-10-02T14:32:00Z',
    paidAt: '2026-10-02T14:31:00Z',
    completedAt: '2026-10-02T14:32:00Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'AURA-ROBLOX-7712',
    customerName: 'Sopheap Meas',
    customerEmail: 'sopheap.meas@gmail.com',
    customerPhone: '012999111',
    gameId: 'roblox',
    gameName: 'Roblox',
    productId: 'rbx-800',
    productName: '800 Robux (+80 Bonus)',
    quantity: 1,
    priceUsd: 9.60,
    feeUsd: 0.00,
    totalUsd: 9.60,
    totalKhr: 39360,
    currency: 'USD',
    playerId: 'Builderman',
    verifiedAccountName: 'Builderman',
    verifiedAvatarUrl: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-156-Png/150/150/AvatarHeadshot/Webp/noFilter',
    paymentMethod: 'ABA_PAY',
    paymentStatus: 'PAID',
    deliveryStatus: 'COMPLETED',
    paymentReference: 'ABA-REF-884102',
    createdAt: '2026-10-03T09:15:00Z',
    updatedAt: '2026-10-03T09:17:00Z',
    paidAt: '2026-10-03T09:16:00Z',
    completedAt: '2026-10-03T09:17:00Z'
  },
  {
    id: 'ord-1003',
    orderNumber: 'AURA-PUBG-4390',
    customerName: 'Vireak Pich',
    customerEmail: 'vireak.pich@yahoo.com',
    customerPhone: '081234567',
    gameId: 'pubgm',
    gameName: 'PUBG Mobile',
    productId: 'pubg-660',
    productName: '660 UC (+60 Bonus UC)',
    quantity: 1,
    priceUsd: 9.80,
    feeUsd: 0.00,
    totalUsd: 9.80,
    totalKhr: 40180,
    currency: 'USD',
    playerId: '5192847192',
    verifiedAccountName: 'SniperAce_PP',
    paymentMethod: 'BAKONG',
    paymentStatus: 'PAYMENT_PROCESSING',
    deliveryStatus: 'PENDING',
    paymentReference: 'BKNG-TRX-10398',
    createdAt: '2026-10-03T18:40:00Z',
    updatedAt: '2026-10-03T18:41:00Z'
  },
  {
    id: 'ord-1004',
    orderNumber: 'AURA-FREEFIRE-5519',
    customerName: 'Channak Ken',
    customerEmail: 'channak.k@gmail.com',
    customerPhone: '097888123',
    gameId: 'freefire',
    gameName: 'Garena Free Fire',
    productId: 'ff-weekly',
    productName: 'Weekly Membership',
    quantity: 1,
    priceUsd: 1.95,
    feeUsd: 0.00,
    totalUsd: 1.95,
    totalKhr: 7995,
    currency: 'USD',
    playerId: '182746209',
    verifiedAccountName: 'BooyahHunter',
    paymentMethod: 'ABA_KHQR',
    paymentStatus: 'WAITING_FOR_PAYMENT',
    deliveryStatus: 'PENDING',
    createdAt: '2026-10-03T20:25:00Z',
    updatedAt: '2026-10-03T20:25:00Z'
  }
];

export const INITIAL_PAYMENT_SETTINGS: PaymentGatewaySettings = {
  abaPayWayEnabled: true,
  abaMerchantId: 'ec438910', // Sandbox Demo Merchant ID
  abaApiKey: '9f8e7d6c5b4a39281726354410a9b8c7',
  abaEnvironment: 'sandbox',
  khqrEnabled: true,
  bakongAccountId: 'auratopup@abaa',
  merchantName: 'AURA TOPUP STORE',
  merchantCity: 'Phnom Penh',
  exchangeRateKhrPerUsd: 4100,
  paymentExpiryMinutes: 15,
  manualProofAllowed: true
};

export const INITIAL_WEBSITE_SETTINGS: WebsiteSettings = {
  siteName: 'AuraTopUp',
  supportEmail: 'support@auratopup.com',
  supportTelegram: 'https://t.me/auratopup_support',
  supportPhone: '+855 23 888 777',
  announcementText: '🔥 Instant Delivery 24/7! Pay seamlessly with ABA PAY & KHQR. Special 10% bonus on MLBB & Roblox!',
  maintenanceMode: false,
  heroHeadline: 'Your Ultimate Gaming Top-Up Destination',
  heroSubtitle: 'Fast, Secure & Trusted Game Credits with Instant ABA Bank & KHQR Payment'
};

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    userId: 'user-superadmin-1',
    userName: 'Sokha Chan (Super Admin)',
    userRole: 'SUPER_ADMIN',
    action: 'SYSTEM_INITIALIZED',
    details: 'ABA PayWay Sandbox credentials & Bakong KHQR configured',
    timestamp: '2026-10-01T08:00:00Z'
  },
  {
    id: 'log-2',
    userId: 'user-admin-1',
    userName: 'Dara Vannak',
    userRole: 'ADMIN',
    action: 'ORDER_COMPLETED',
    details: 'Completed MLBB Order AURA-MLBB-9281 (257 Diamonds)',
    timestamp: '2026-10-02T14:32:00Z'
  },
  {
    id: 'log-3',
    userId: 'user-superadmin-1',
    userName: 'Sokha Chan (Super Admin)',
    userRole: 'SUPER_ADMIN',
    action: 'STOCK_RESTOCKED',
    details: 'Increased Roblox 800 Robux stock to 550 units',
    timestamp: '2026-10-03T10:00:00Z'
  }
];
