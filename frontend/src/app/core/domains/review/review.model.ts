export interface Review {
  id: string;
  user: { id: string; firstName: string; lastName: string };
  shop: string;
  rating: number;
  comment?: string;
  status: string;
  createdAt: string;
}
