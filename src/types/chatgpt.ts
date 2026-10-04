export interface ArtifactItem {
  id: string;
  name: string;
  type: 'image' | 'markdown' | 'code' | 'pdf' | 'folder';
  modifiedText: string;
  modifiedTimestamp: number;
  isFavorite: boolean;
  thumbnailUrl?: string;
  fileSize?: string;
  dimensions?: string;
  originChat?: {
    id: string;
    title: string;
  };
  content?: string;
  folderId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  isPinned: boolean;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface UserProfile {
  name: string;
  email: string;
  plan: string;
  initials: string;
}
