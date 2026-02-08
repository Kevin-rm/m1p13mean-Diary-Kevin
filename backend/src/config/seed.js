import Profile from "../modules/users/profile.model.js";
import Role from "../modules/users/role.model.js";
import logger from "./logger.js";

const profiles = [
  {
    code: "admin",
    label: "Administrator",
    description: "Shopping center administrator with management permissions",
    permissions: [
      "shops:create",
      "shops:validate",
      "shops:suspend",
      "categories:read",
      "categories:write",
      "stats:read",
      "stats:global",
      "moderation:reviews",
      "moderation:products",
    ],
  },
  {
    code: "shop",
    label: "Shop",
    description: "Shop owner or member with shop-related permissions",
    permissions: [
      "categories:read",
      "products:read",
      "products:write",
      "orders:read",
      "orders:manage",
      "shop:settings",
      "members:read",
      "members:manage",
      "stats:read",
    ],
  },
  {
    code: "buyer",
    label: "Buyer",
    description: "Customer who can browse and purchase products",
    permissions: [
      "categories:read",
      "products:read",
      "orders:read",
      "orders:create",
      "cart:manage",
      "reviews:write",
      "favorites:manage",
    ],
  },
];

const roles = [
  { code: "owner", label: "Owner", description: "Shop owner with full access" },
  { code: "manager", label: "Manager", description: "Shop manager" },
  { code: "seller", label: "Seller", description: "Shop seller" },
];

export async function seedDatabase() {
  await Promise.all([
    Profile.bulkWrite(
      profiles.map(profile => ({
        updateOne: {
          filter: { code: profile.code },
          update: { $set: profile },
          upsert: true,
        },
      })),
    ),
    Role.bulkWrite(
      roles.map(role => ({
        updateOne: {
          filter: { code: role.code },
          update: { $set: role },
          upsert: true,
        },
      })),
    ),
  ]);

  logger.info("Database seeded (profiles & roles)");
}
