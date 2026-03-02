import { BaseModel } from "@core/common/models/base-model";

export interface Category extends BaseModel {
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
}
