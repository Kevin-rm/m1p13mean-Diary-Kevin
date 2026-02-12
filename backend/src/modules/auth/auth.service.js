import User from "../users/user.model.js";
import Profile from "../users/profile.model.js";
import Role from "../users/role.model.js";
import UserContext from "../users/userContext.model.js";
import Shop from "../shops/shop.model.js";
import RefreshToken from "./refreshToken.model.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/security/jwt.js";
import { refreshTokenConfig } from "../../config/auth.js";
import { withTransaction } from "../../utils/db/withTransaction.js";

async function generateTokens(user, context, profileCode, session = null) {
  const tokenPayload = {
    userId: user._id.toString(),
    contextId: context._id.toString(),
    profileCode,
  };

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
        expiresAt: new Date(Date.now() + refreshTokenConfig.maxAgeMs),
      },
    ],
    session ? { session } : {},
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

export async function login({ email, password }) {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) return null;

  const context = await UserContext.findOne({ user: user._id, isActive: true }).populate("profile");
  if (!context) return null;

  const { accessToken, refreshToken } = await generateTokens(user, context, context.profile.code);

  user.lastLoginAt = new Date();
  await user.save();

  return { user, context, accessToken, refreshToken };
}

export async function getMe(userId, contextId) {
  const [user, context] = await Promise.all([
    User.findById(userId),
    UserContext.findById(contextId).populate("profile").populate("role").populate("shop"),
  ]);
  if (!user || !context) return null;
  return { user, context };
}
