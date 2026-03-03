import { BaseModel } from "@core/common/models/base-model";
import { TagConfig } from "@shared/components/app-tag";

export interface MovementLine {
  product: { id: string; name: string };
  quantity: number;
  previousStock: number;
  newStock: number;
}

export interface StockMovement extends BaseModel {
  date: string;
  type: "in" | "out" | "adjustment";
  note?: string;
  lineCount: number;
  lines: MovementLine[];
  performedBy: { id: string; firstName: string; lastName: string };
}

export const MOVEMENT_TYPES = ["in", "out", "adjustment"] as const;

export const MOVEMENT_TYPE_OPTIONS = [
  { label: "Tous les types", value: "" },
  { label: "Entrée", value: "in" },
  { label: "Sortie", value: "out" },
  { label: "Ajustement", value: "adjustment" },
];

export const MOVEMENT_TYPE_TAG: Record<string, TagConfig> = {
  in: { label: "Entrée", severity: "success" },
  out: { label: "Sortie", severity: "danger" },
  adjustment: { label: "Ajustement", severity: "warn" },
};
