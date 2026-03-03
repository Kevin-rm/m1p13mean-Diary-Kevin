import { BaseModel } from "@core/common/models/base-model";
import { TagConfig } from "@shared/components/app-tag";

export interface OrderItem {
  product: string;
  productName: string;
  productPrice: number;
  productImageUrl?: string;
  quantity: number;
  subtotal: number;
}

export interface StatusChange {
  from: string;
  to: string;
  changedBy: string;
  changedAt: string;
  reason?: string;
}

export interface Order extends BaseModel {
  orderNumber: string;
  buyer: { id: string; firstName: string; lastName: string; email?: string };
  shop: { id: string; name: string; logoUrl?: string };
  items: OrderItem[];
  totalAmount: number;
  status: string;
  statusHistory: StatusChange[];
  note?: string;
  checkoutRef?: string;
}

export const ORDER_STATUS_CONFIG: Record<string, TagConfig> = {
  pending: { label: "En attente", severity: "warn" },
  confirmed: { label: "Confirmée", severity: "success" },
  refused: { label: "Refusée", severity: "danger" },
  cancelled: { label: "Annulée", severity: "secondary" },
};
