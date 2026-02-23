export interface Shop {
  id: string;
  name: string;
  image: string[];
  description: string;
  contactEmail?: string;
  contactPhone?: string;
  owner?: { id: string; firstName: string; lastName: string; email: string };
}
