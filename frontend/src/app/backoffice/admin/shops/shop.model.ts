import { BaseModel } from "@core/models/base-model";

export interface ScheduleSlot {
  day: string;
  openTime: string;
  closeTime: string;
}

export interface Shop extends BaseModel {
  name: string;
  description: string;
  status: "pending" | "active" | "suspended";
  logoUrl?: string;
  images: string[];
  contactEmail?: string;
  contactPhone?: string;
  schedule: ScheduleSlot[];
  owner?: { id: string; firstName: string; lastName: string; email: string };
}
