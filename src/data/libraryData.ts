import { ArtifactItem, ChatConversation, UserProfile } from '../types/chatgpt';
import lavenderStorefront from '../assets/images/lavender_storefront_1791086297017.jpg';
import godriveDashboard from '../assets/images/godrive_dashboard_1791086310266.jpg';
import galazzoCrown from '../assets/images/galazzo_crown_1791086321656.jpg';
import heroGaming from '../assets/images/hero_gaming_banner_1791085620819.jpg';
import fintechPayment from '../assets/images/fintech_payment_art_1791085633314.jpg';

export const INITIAL_USER: UserProfile = {
  name: 'Rath Bunnarong',
  email: 'bunnarongrath3@gmail.com',
  plan: 'Free',
  initials: 'RB'
};

export const INITIAL_ARTIFACTS: ArtifactItem[] = [
  {
    id: 'libfile_eca16e185df88191b1c4e4e31965bc39',
    name: 'Lavender Gaming Top-Up Storefront.png',
    type: 'image',
    modifiedText: 'Modified 20m ago',
    modifiedTimestamp: Date.now() - 20 * 60 * 1000,
    isFavorite: false,
    thumbnailUrl: lavenderStorefront,
    fileSize: '1.4 MB',
    dimensions: '1024 × 1024 px',
    originChat: {
      id: '6aa808cf-3b48-83ec-8c7a-ec7bffd2afaf',
      title: 'Create RongzStore Prompt'
    }
  },
  {
    id: 'libfile_b36f9fd7fa84819182d6d57d2f2b1ff9',
    name: 'saved-image-file_00000000363082079b375d27660c1399.jpg',
    type: 'image',
    modifiedText: 'Modified 23m ago',
    modifiedTimestamp: Date.now() - 23 * 60 * 1000,
    isFavorite: true,
    thumbnailUrl: heroGaming,
    fileSize: '2.1 MB',
    dimensions: '1920 × 1080 px',
    originChat: {
      id: '6ab134c4-e0f8-83ec-bf76-bb94fd5d1d1c',
      title: 'Write Topup Website Prompt'
    }
  },
  {
    id: 'libfile_acf21e1b02288191849ace5f3e9d5ab3',
    name: 'GoDrive Ride-Hailing Dashboard Showcase.png',
    type: 'image',
    modifiedText: 'Modified 1h ago',
    modifiedTimestamp: Date.now() - 60 * 60 * 1000,
    isFavorite: false,
    thumbnailUrl: godriveDashboard,
    fileSize: '1.8 MB',
    dimensions: '1024 × 1024 px',
    originChat: {
      id: '6ac1bf94-97d8-83ec-a9b3-86fb0afbac2d',
      title: 'Build Grab Like Website'
    }
  },
  {
    id: 'libfile_39429048703c8191b6852c53cf87d786',
    name: 'Pasted markdown',
    type: 'markdown',
    modifiedText: 'Modified 2w ago',
    modifiedTimestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
    isFavorite: false,
    fileSize: '14.2 KB',
    originChat: {
      id: '6ac1c7cd-9db4-83ec-b111-1fcbbdfdae70',
      title: 'Website Prompt Writing'
    },
    content: `# Master Specification: Enterprise Web Application

## Core Architecture
- **Framework:** React 19 + TypeScript + Vite + Tailwind CSS
- **Backend:** Express API with asynchronous worker routes
- **Database:** PostgreSQL / Cloud SQL persistent storage
- **Payment Switching:** Bakong National EMVCo KHQR + ABA PayWay Direct

\`\`\`typescript
interface PaymentVerification {
  billNumber: string;
  amount: number;
  currency: 'USD' | 'KHR';
  checksum: string;
}
\`\`\`

### Status & Verification Workflow
1. Request payload signed with HMAC-SHA512.
2. QR code generated according to EMVCo Merchant-Presented Mode specifications.
3. Server webhook listens for status callback.`
  },
  {
    id: 'libfile_ae98f14f0a388191b412f70dace0bac7',
    name: 'Galazzo Crown Emblem Logo.png',
    type: 'image',
    modifiedText: 'Modified 1mo ago',
    modifiedTimestamp: Date.now() - 30 * 24 * 60 * 60 * 1000,
    isFavorite: false,
    thumbnailUrl: galazzoCrown,
    fileSize: '890 KB',
    dimensions: '1024 × 1024 px',
    originChat: {
      id: '6a929d2a-8be0-83ec-a8b8-612418967270',
      title: 'Create Logo Design'
    }
  },
  {
    id: 'libfile_46197899cef88191bb36fa9666551bcf',
    name: 'd4a7a8fd-0b77-4794-a2a2-f553d7d8b697.png',
    type: 'image',
    modifiedText: 'Modified 22m ago',
    modifiedTimestamp: Date.now() - 22 * 60 * 1000,
    isFavorite: false,
    thumbnailUrl: fintechPayment,
    fileSize: '1.2 MB',
    dimensions: '1024 × 768 px',
    originChat: {
      id: '6ab134c4-e0f8-83ec-bf76-bb94fd5d1d1c',
      title: 'Write Topup Website Prompt'
    }
  }
];

export const INITIAL_CONVERSATIONS: ChatConversation[] = [
  // Pinned
  {
    id: '6aa808cf-3b48-83ec-8c7a-ec7bffd2afaf',
    title: 'Create RongzStore Prompt',
    isPinned: true,
    updatedAt: '20m ago',
    messages: [
      { id: 'm1', role: 'user', content: 'Create a prompt for a complete modern gaming store called RongzStore with ABA KHQR payment and Mobile Legends topup.', timestamp: '20m ago' },
      { id: 'm2', role: 'assistant', content: 'Here is the master prompt for RongzStore with dark esports aesthetics, instant MLBB diamond verification, stock management, and dynamic ABA KHQR payment.', timestamp: '19m ago' }
    ]
  },
  {
    id: '6aa816f4-4ac4-83ec-a91b-208a59f2341c',
    title: 'Create RongzStore Prompt',
    isPinned: true,
    updatedAt: '1h ago',
    messages: [
      { id: 'm3', role: 'user', content: 'Let us refine the color palette for RongzStore with lavender purple and neon cyan accents.', timestamp: '1h ago' },
      { id: 'm4', role: 'assistant', content: 'Updated! Here is the revised UI design specifications with glassmorphism cards and clean typography.', timestamp: '1h ago' }
    ]
  },
  {
    id: '6ac1c7cd-9db4-83ec-b111-1fcbbdfdae70',
    title: 'Website Prompt Writing',
    isPinned: true,
    updatedAt: '3h ago',
    messages: [
      { id: 'm5', role: 'user', content: 'Help me draft a comprehensive prompt for fullstack web application development.', timestamp: '3h ago' },
      { id: 'm6', role: 'assistant', content: 'Here is the comprehensive specification covering frontend, backend, database schemas, and API integrations.', timestamp: '3h ago' }
    ]
  },

  // Recents
  {
    id: '6ac1bf94-97d8-83ec-a9b3-86fb0afbac2d',
    title: 'Build Grab Like Website',
    isPinned: false,
    updatedAt: '1h ago',
    messages: [
      { id: 'm7', role: 'user', content: 'How do I build a ride-hailing web platform like Grab with interactive driver and booking dashboards?', timestamp: '1h ago' }
    ]
  },
  {
    id: '6ac11d03-33a4-83ec-a01f-f61d86aaebb3',
    title: 'UEFA match predictions',
    isPinned: false,
    updatedAt: '5h ago',
    messages: [
      { id: 'm8', role: 'user', content: 'Analyze the upcoming UEFA Champions League group fixtures and give tactical match predictions.', timestamp: '5h ago' }
    ]
  },
  {
    id: '6ab134c4-e0f8-83ec-bf76-bb94fd5d1d1c',
    title: 'Write Topup Website Prompt',
    isPinned: false,
    updatedAt: 'Yesterday',
    messages: [
      { id: 'm9', role: 'user', content: 'Write a complete master prompt for a gaming top-up store supporting MLBB, Free Fire, PUBG Mobile, and Roblox with ABA Bank KHQR.', timestamp: 'Yesterday' }
    ]
  },
  {
    id: '6a954c34-10dc-83ec-86a4-e32a6b708ef9',
    title: 'Generate Laravel Project Prompt',
    isPinned: false,
    updatedAt: '2d ago',
    messages: [
      { id: 'm10', role: 'user', content: 'Generate a detailed Laravel 11 + Vue Inertia starter specification.', timestamp: '2d ago' }
    ]
  },
  {
    id: '6a929d2a-8be0-83ec-a8b8-612418967270',
    title: 'Create Logo Design',
    isPinned: false,
    updatedAt: '3d ago',
    messages: [
      { id: 'm11', role: 'user', content: 'Design a luxury metallic crown emblem logo for Galazzo brand.', timestamp: '3d ago' }
    ]
  },
  {
    id: '6a2d17b5-c484-83ec-b376-52cedffce71f',
    title: 'Laravel Vendor Issue',
    isPinned: false,
    updatedAt: '5d ago',
    messages: [
      { id: 'm12', role: 'user', content: 'composer dump-autoload error in Laravel vendor directory', timestamp: '5d ago' }
    ]
  },
  {
    id: '6a04586b-a8dc-83ec-8d22-4306e920a88e',
    title: 'Oracle DB Exam Tasks',
    isPinned: false,
    updatedAt: '1w ago',
    messages: [
      { id: 'm13', role: 'user', content: 'Oracle PL/SQL procedure and trigger review questions for university exam', timestamp: '1w ago' }
    ]
  },
  {
    id: '69ef7158-d554-8322-948a-508a20b1955a',
    title: 'ExecuteNonQuery Parameter Fix',
    isPinned: false,
    updatedAt: '1w ago',
    messages: [
      { id: 'm14', role: 'user', content: 'C# SqlCommand ExecuteNonQuery parameter null reference fix', timestamp: '1w ago' }
    ]
  },
  {
    id: '69ea1534-6ae0-8321-ae1e-3b73cbabb97d',
    title: 'Fixing WinForms Error',
    isPinned: false,
    updatedAt: '2w ago',
    messages: [
      { id: 'm15', role: 'user', content: 'WinForms Designer file compilation and DPI scaling issue', timestamp: '2w ago' }
    ]
  },
  {
    id: '69ea1378-3154-8324-97cb-d5434dfcbbc3',
    title: 'WinForms Designer Fix',
    isPinned: false,
    updatedAt: '2w ago',
    messages: [
      { id: 'm16', role: 'user', content: 'How to restore corrupted InitializeComponent in WinForms', timestamp: '2w ago' }
    ]
  },
  {
    id: '69d2144e-1d6c-8321-a064-3ad77f30866b',
    title: 'កូដគណនាកម្ចី',
    isPinned: false,
    updatedAt: '2w ago',
    messages: [
      { id: 'm17', role: 'user', content: 'សរសេរកូដ PHP គណនាការប្រាក់កម្ចីប្រចាំខែ (Loan Amortization Calculator)', timestamp: '2w ago' }
    ]
  },
  {
    id: '69d20dd1-5174-8323-b5b5-66c94ad6dfc4',
    title: 'ការគណនាកម្ចី PHP',
    isPinned: false,
    updatedAt: '3w ago',
    messages: [
      { id: 'm18', role: 'user', content: 'ការគណនាអត្រាការប្រាក់ថយចុះ (Declining balance interest) ក្នុង PHP', timestamp: '3w ago' }
    ]
  },
  {
    id: '69d20b52-1bf4-8323-95b8-a022f824dc94',
    title: 'គណនាអត្រាប្រចាំខែ',
    isPinned: false,
    updatedAt: '3w ago',
    messages: [
      { id: 'm19', role: 'user', content: 'រូបមន្តគណនាការបង់រំលស់ប្រចាំខែ', timestamp: '3w ago' }
    ]
  },
  {
    id: '69d2022a-aeb8-839b-b0ee-07634c06f0a0',
    title: 'PHP Loan Calculator',
    isPinned: false,
    updatedAt: '3w ago',
    messages: [
      { id: 'm20', role: 'user', content: 'Create a clean HTML & Bootstrap form for loan calculations with PDF export', timestamp: '3w ago' }
    ]
  },
  {
    id: '69b64f5a-6c78-8324-a4b3-1e937bc98ace',
    title: 'PHP Student Score Calculator',
    isPinned: false,
    updatedAt: '1mo ago',
    messages: [
      { id: 'm21', role: 'user', content: 'PHP OOP system for student grade evaluation and GPA grading', timestamp: '1mo ago' }
    ]
  },
  {
    id: '69b64e86-7498-8320-b729-3c8c7780fa07',
    title: 'Prompt សម្រាប់ AI',
    isPinned: false,
    updatedAt: '1mo ago',
    messages: [
      { id: 'm22', role: 'user', content: 'របៀបសរសេរ Prompt ឲ្យ AI បង្កើតគេហទំព័រពេញលេញ', timestamp: '1mo ago' }
    ]
  },
  {
    id: '69a3e91e-eedc-8323-8a00-eeb52aa8142b',
    title: 'PHP វិក័យប័ត្រអគ្គិសនី',
    isPinned: false,
    updatedAt: '1mo ago',
    messages: [
      { id: 'm23', role: 'user', content: 'កម្មវិធីគណនាថ្លៃភ្លើង EDC (Electricity Bill Calculator) តាមកាំពន្ធ', timestamp: '1mo ago' }
    ]
  },
  {
    id: '69aa7875-4824-8398-96b4-4af78af219d0',
    title: 'Dropdown Homework CSS',
    isPinned: false,
    updatedAt: '1mo ago',
    messages: [
      { id: 'm24', role: 'user', content: 'Pure CSS multi-level dropdown menu with transition animations', timestamp: '1mo ago' }
    ]
  },
  {
    id: '69a64171-a290-8322-aace-a22bcc15309e',
    title: 'Django Migration Fix',
    isPinned: false,
    updatedAt: '1mo ago',
    messages: [
      { id: 'm25', role: 'user', content: 'Django inconsistent migration history error fix', timestamp: '1mo ago' }
    ]
  },
  {
    id: '69a5a0be-8b74-8324-9397-fc55a37f4b4e',
    title: 'ដាក់រូបក្នុង Python',
    isPinned: false,
    updatedAt: '1mo ago',
    messages: [
      { id: 'm26', role: 'user', content: 'របៀបដាក់រូបភាពក្នុង Tkinter ដោយប្រើ PIL (Pillow library)', timestamp: '1mo ago' }
    ]
  },
  {
    id: '69a4e825-2d74-8323-a9cf-4e3c85accc6e',
    title: 'Tour Management Website',
    isPinned: false,
    updatedAt: '2mo ago',
    messages: [
      { id: 'm27', role: 'user', content: 'Build a Cambodian tourism and travel booking web application', timestamp: '2mo ago' }
    ]
  },
  {
    id: '69675a23-2bcc-8329-bdd2-23bbe4a814e9',
    title: 'សំណាងថ្ងៃនេះ',
    isPinned: false,
    updatedAt: '2mo ago',
    messages: [
      { id: 'm28', role: 'user', content: 'ជោគជតារាសី និងសំណាងប្រចាំថ្ងៃ', timestamp: '2mo ago' }
    ]
  },
  {
    id: '69620bbe-2f14-8324-bdcc-6c06ddf5310c',
    title: 'Web Comparison and Explanation',
    isPinned: false,
    updatedAt: '2mo ago',
    messages: [
      { id: 'm29', role: 'user', content: 'Compare monolithic vs microservices architecture for e-commerce', timestamp: '2mo ago' }
    ]
  },
  {
    id: '69620b98-5a74-8321-9999-bfa2bc12dbfe',
    title: 'Example chat: Ask anything',
    isPinned: false,
    updatedAt: '2mo ago',
    messages: [
      { id: 'm30', role: 'user', content: 'Hello ChatGPT!', timestamp: '2mo ago' }
    ]
  }
];
