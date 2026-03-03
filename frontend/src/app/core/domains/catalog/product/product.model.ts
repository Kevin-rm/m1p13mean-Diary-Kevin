import { BaseModel } from "@core/common/models/base-model";

export interface Product extends BaseModel {
  name: string;
  description?: string;
  price: number;
  stock: number;
  images: string[];
  isActive: boolean;
  shop: string;
  category: { id: string; name: string };
}
