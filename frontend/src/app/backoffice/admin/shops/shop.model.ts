import { BaseModel } from "@core/models/base-model";

export interface Shop extends BaseModel {
  name: string;
  description: string;
  status: "pending" | "active" | "suspended";
  images: string[];
  contactEmail?: string;
  contactPhone?: string;
  owner?: { id: string; firstName: string; lastName: string; email: string };
}
