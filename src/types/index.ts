export type GameId = 'mlbb' | 'freefire' | 'pubgm' | 'roblox';

export interface Game {
  id: GameId;
  name: string;
  publisher: string;
  tagline: string;
  category: string;
  idLabel: string;
  idPlaceholder: string;
  hasZoneId?: boolean;
  zoneIdLabel?: string;
  zoneIdPlaceholder?: string;
  guideNote: string;
  bannerUrl?: string;
  color: string;
  popular?: boolean;
}

export interface Product {
  id: string;
  gameId: GameId;
  name: string;
  itemCount: number;
  itemUnit: string;
  priceUsd: number;
  bonus?: string;
  stock: number;
  isUnlimitedStock: boolean;
  soldCount: number;
  isActive: boolean;
  isPopular?: boolean;
}

export type PaymentMethodType = 'ABA_PAY' | 'ABA_KHQR' | 'BAKONG' | 'WING' | 'ACLEDAMOBILE';

export type PaymentStatus = 
  | 'WAITING_FOR_PAYMENT'
  | 'PAYMENT_PROCESSING'
  | 'PAID'
  | 'FAILED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'REFUNDED';

export type DeliveryStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export interface PlayerVerificationResult {
  verified: boolean;
  gameId: GameId;
  playerId: string;
  zoneId?: string;
  accountName?: string;
  avatarUrl?: string;
  statusText: string;
  verificationType: 'OFFICIAL_API' | 'MANUAL_PENDING' | 'INVALID_FORMAT' | 'NOT_FOUND';
  details?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  gameId: GameId;
  gameName: string;
  productId: string;
  productName: string;
  quantity: number;
  priceUsd: number;
  feeUsd: number;
  totalUsd: number;
  totalKhr: number;
  currency: 'USD' | 'KHR';
  playerId: string;
  zoneId?: string;
  verifiedAccountName?: string;
  verifiedAvatarUrl?: string;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  paymentReference?: string;
  khqrPayload?: string;
  paymentScreenshot?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  completedAt?: string;
}

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
  isActive: boolean;
  avatar?: string;
}

export interface PaymentGatewaySettings {
  abaPayWayEnabled: boolean;
  abaMerchantId: string;
  abaApiKey: string;
  abaEnvironment: 'sandbox' | 'production';
  khqrEnabled: boolean;
  bakongAccountId: string;
  merchantName: string;
  merchantCity: string;
  exchangeRateKhrPerUsd: number;
  paymentExpiryMinutes: number;
  manualProofAllowed: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface WebsiteSettings {
  siteName: string;
  supportEmail: string;
  supportTelegram: string;
  supportPhone: string;
  announcementText: string;
  maintenanceMode: boolean;
  heroHeadline: string;
  heroSubtitle: string;
}
