export interface Invitation {
  id: string;
  user: { id: string; firstName: string; lastName: string; email: string; avatarUrl?: string };
  role: { id: string; code: string; label: string };
  status: "pending" | "accepted" | "declined" | "cancelled";
  shop?: { id: string; name: string };
  invitedBy?: { id: string; firstName: string; lastName: string };
  createdAt: string;
}
