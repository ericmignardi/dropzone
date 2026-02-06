export interface ShareLink {
  id: string;
  shortCode: string;
  password: string;
  expiresAt: Date;
  fileId: string;
  file: UserFile;
  createdAt: Date;
}

export interface UserFile {
  id: string;
  name: string;
  originalName: string;
  size: number;
  mimeType: string;
  cloudinaryId: string;
  cloudinaryUrl: string;
  downloads: number;
  views: number;
  user: User;
  userId: string;
  shareLinks: ShareLink[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  files: UserFile[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  verify: () => Promise<void>;
  isVerifying: boolean;
  register: (data: RegisterData) => Promise<void>;
  isRegistering: boolean;
  login: (data: LoginData) => Promise<void>;
  isLoggingIn: boolean;
  logout: () => Promise<void>;
  isLoggingOut: boolean;
}
