export interface Shop {
  id: string;
  name: string;
  description: string;
  status: "pending" | "active" | "suspended";
  images: string[];
  contactEmail?: string;
  contactPhone?: string;
  owner?: { id: string; firstName: string; lastName: string; email: string };
  createdAt: string;
  updatedAt: string;
}
