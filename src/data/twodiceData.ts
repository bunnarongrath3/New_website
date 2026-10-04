import { GameItem } from '../components/twodice/HangingGameCard';
import freefireArt from '../assets/images/freefire_art_1791086695846.jpg';
import genshinArt from '../assets/images/genshin_art_1791086708959.jpg';
import mlbbArt from '../assets/images/mlbb_art_1791086721969.jpg';
import heroGaming from '../assets/images/hero_gaming_banner_1791085620819.jpg';
import fintechPayment from '../assets/images/fintech_payment_art_1791085633314.jpg';
import lavenderStorefront from '../assets/images/lavender_storefront_1791086297017.jpg';
import godriveDashboard from '../assets/images/godrive_dashboard_1791086310266.jpg';
import galazzoCrown from '../assets/images/galazzo_crown_1791086321656.jpg';

export const EXCLUSIVE_OFFERS: GameItem[] = [
  {
    id: 'freefire',
    name: 'Free Fire / Free Fire MAX (India)',
    category: 'Battle Royale',
    discountBadge: '-5.0%',
    tag: 'Promo',
    imageUrl: freefireArt,
    publisher: 'Garena',
    startingPriceUsd: 0.95
  },
  {
    id: 'roblox',
    name: 'Roblox',
    category: 'Metaverse',
    discountBadge: '-7.5%',
    tag: 'Promo',
    imageUrl: lavenderStorefront,
    publisher: 'Roblox Corp',
    startingPriceUsd: 0.99
  },
  {
    id: 'identityv',
    name: 'Identity V',
    category: 'Survival Horror',
    discountBadge: '-7.5%',
    tag: 'Promo',
    imageUrl: godriveDashboard,
    publisher: 'NetEase Games',
    startingPriceUsd: 1.20
  },
  {
    id: 'genshin',
    name: 'Genshin Impact',
    category: 'Action RPG',
    discountBadge: '-12.0%',
    tag: 'Promo',
    imageUrl: genshinArt,
    publisher: 'HoYoverse',
    startingPriceUsd: 0.99
  },
  {
    id: 'mlbb',
    name: 'Mobile Legends',
    category: 'MOBA',
    discountBadge: '-4.5%',
    tag: 'Promo',
    imageUrl: mlbbArt,
    publisher: 'Moonton',
    startingPriceUsd: 1.40
  },
  {
    id: 'ragnarok',
    name: 'Ragnarok Origin',
    category: 'MMORPG',
    discountBadge: '-7.0%',
    tag: 'Promo',
    imageUrl: galazzoCrown,
    publisher: 'Gravity',
    startingPriceUsd: 2.50
  }
];

export const LATEST_PRODUCTS: GameItem[] = [
  {
    id: 'persona5',
    name: 'Persona 5: The Phantom X',
    category: 'JRPG',
    discountBadge: '-8.0%',
    tag: 'Hot',
    imageUrl: fintechPayment,
    publisher: 'SEGA / Perfect World',
    startingPriceUsd: 1.99
  },
  {
    id: 'hsr',
    name: 'Honkai: Star Rail',
    category: 'Turn-Based RPG',
    discountBadge: '-10.0%',
    tag: 'Popular',
    imageUrl: genshinArt,
    publisher: 'HoYoverse',
    startingPriceUsd: 0.99
  },
  {
    id: 'maplestory',
    name: 'MapleStory M',
    category: 'Side-Scroller RPG',
    discountBadge: '-6.0%',
    tag: 'Promo',
    imageUrl: freefireArt,
    publisher: 'Nexon',
    startingPriceUsd: 1.50
  },
  {
    id: 'nikke',
    name: 'Goddess of Victory: Nikke',
    category: 'Sci-Fi Shooter',
    discountBadge: '-5.0%',
    tag: 'Promo',
    imageUrl: mlbbArt,
    publisher: 'Level Infinite',
    startingPriceUsd: 2.99
  },
  {
    id: 'hsr_pass',
    name: 'Honkai: Star Rail Express Pass',
    category: 'Monthly Pass',
    discountBadge: '-15.0%',
    tag: 'Best Deal',
    imageUrl: heroGaming,
    publisher: 'HoYoverse',
    startingPriceUsd: 4.99
  },
  {
    id: 'battlenet',
    name: 'Battle.net Gift Card',
    category: 'Digital Voucher',
    discountBadge: '-3.0%',
    tag: 'Instant Card',
    imageUrl: lavenderStorefront,
    publisher: 'Blizzard Entertainment',
    startingPriceUsd: 5.00
  }
];
