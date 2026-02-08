import User from "../users/user.model.js";
import Profile from "../users/profile.model.js";
import Role from "../users/role.model.js";
import UserContext from "../users/userContext.model.js";
import Shop from "../shops/shop.model.js";
import RefreshToken from "./refreshToken.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiryDate,
} from "../../shared/utils/jwt.js";
import { withTransaction } from "../../shared/utils/withTransaction.js";

async function generateTokens(user, context, profileCode, session) {
  const tokenPayload = { userId: user._id, contextId: context._id, profileCode };

  const [accessToken, refreshToken] = await Promise.all([
    generateAccessToken(tokenPayload),
    generateRefreshToken(tokenPayload),
  ]);

  await RefreshToken.create(
    [
      {
        token: refreshToken,
        user: user._id,
        userContext: context._id,
        expiresAt: await getRefreshTokenExpiryDate(refreshToken),
      },
    ],
    { session },
  );

  return { accessToken, refreshToken };
}

export async function registerBuyer({ firstName, lastName, email, password }) {
  return withTransaction(async session => {
    const [user] = await User.create([{ firstName, lastName, email, password }], { session });

    const buyerProfile = await Profile.findOne({ code: "buyer" }).session(session);
    if (!buyerProfile) throw new Error("Buyer profile not found. Database may not be seeded.");

    const [context] = await UserContext.create([{ user: user._id, profile: buyerProfile._id }], {
      session,
    });

    const { accessToken, refreshToken } = await generateTokens(
      user,
      context,
      buyerProfile.code,
      session,
    );

    return { user, context, accessToken, refreshToken };
  });
}

export async function registerShop({
  firstName,
  lastName,
  email,
  password,
  shopName,
  shopDescription,
}) {
  return withTransaction(async session => {
    const [user] = await User.create([{ firstName, lastName, email, password }], { session });

    const [shop] = await Shop.create(
      [{ name: shopName, description: shopDescription, createdBy: user._id }],
      { session },
    );

    const [shopProfile, ownerRole] = await Promise.all([
      Profile.findOne({ code: "shop" }).session(session),
      Role.findOne({ code: "owner" }).session(session),
    ]);

    if (!shopProfile || !ownerRole) {
      throw new Error("Shop profile or owner role not found. Database may not be seeded.");
    }

    const [context] = await UserContext.create(
      [{ user: user._id, profile: shopProfile._id, role: ownerRole._id, shop: shop._id }],
      { session },
    );

    const { accessToken, refreshToken } = await generateTokens(
      user,
      context,
      shopProfile.code,
      session,
    );

    return { user, context, shop, accessToken, refreshToken };
  });
}
