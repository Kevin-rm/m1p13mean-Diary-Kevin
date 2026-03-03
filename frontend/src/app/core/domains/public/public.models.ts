import { ScheduleSlot } from "@core/domains/shop/shop.model";

export interface PublicShop {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  images: string[];
  contactEmail?: string;
  contactPhone?: string;
  schedule: ScheduleSlot[];
  averageRating: number;
  totalReviews: number;
  owner?: { firstName: string; lastName: string };
}

export interface PublicProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  stock: number;
  category: { id: string; name: string };
  shop: { id: string; name: string; logoUrl?: string };
}

export interface PublicCategory {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}
