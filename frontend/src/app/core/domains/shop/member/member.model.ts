export interface Member {
  id: string;
  user: { id: string; firstName: string; lastName: string; email: string; avatarUrl?: string };
  role: { id: string; code: string; label: string };
  isActive: boolean;
  createdAt: string;
}
