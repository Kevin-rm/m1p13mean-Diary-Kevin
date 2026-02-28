import User from "#modules/users/user.model.js";
import Profile from "#modules/users/profile.model.js";
import Role from "#modules/users/role.model.js";
import UserContext from "#modules/users/userContext.model.js";
import Shop from "#modules/shops/shop.model.js";
import RefreshToken from "./refreshToken.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "#utils/security/jwt.js";
import { throwIfDuplicateKey } from "#utils/db/errors.js";
import { refreshTokenConfig } from "#config/auth.js";
import { withTransaction } from "#utils/db/withTransaction.js";

export async function generateTokens(user, context, profile, role = null, session = null) {
  const tokenPayload = {
    userId: user._id.toString(),
    contextId: context._id.toString(),
    profileCode: profile.code,
    permissions: [...(profile.permissions ?? []), ...(role?.permissions ?? [])],
    ...(context.shop && { shop: context.shop.toString() }),
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

export async function registerCustomer({ firstName, lastName, email, password }) {
  return withTransaction(async session => {
    let user;
    try {
      [user] = await User.create([{ firstName, lastName, email, password }], { session });
    } catch (error) {
      throwIfDuplicateKey(error, { email: "Email already in use" });
    }

    const customerProfile = await Profile.findOne({ code: "customer" }).session(session);
    if (!customerProfile)
      throw new Error("Customer profile not found. Database may not be seeded.");

    const [context] = await UserContext.create([{ user: user._id, profile: customerProfile._id }], {
      session,
    });

    const { accessToken, refreshToken } = await generateTokens(
      user,
      context,
      customerProfile,
      null,
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
  contactEmail,
  contactPhone,
}) {
  return withTransaction(async session => {
    let user;
    try {
      [user] = await User.create([{ firstName, lastName, email, password }], { session });
    } catch (error) {
      throwIfDuplicateKey(error, { email: "Email already in use" });
    }

    let shop;
    try {
      [shop] = await Shop.create(
        [
          {
            name: shopName,
            description: shopDescription,
            contactEmail,
            contactPhone,
            owner: user._id,
          },
        ],
        { session },
      );
    } catch (error) {
      throwIfDuplicateKey(error, { name: "Shop name already taken" });
    }

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
      shopProfile,
      ownerRole,
      session,
    );

    return { user, context, shop, accessToken, refreshToken };
  });
}

export async function login({ email, password }) {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) return null;

  const context = await UserContext.findOne({ user: user._id, isActive: true })
    .sort({ updatedAt: -1 })
    .populate("profile")
    .populate("role");
  if (!context) return null;

  const { accessToken, refreshToken } = await generateTokens(
    user,
    context,
    context.profile,
    context.role,
  );

  User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() }).catch(() => {});

  return { user, context, accessToken, refreshToken };
}

export async function logout(refreshTokenValue) {
  await RefreshToken.findOneAndUpdate(
    { token: refreshTokenValue, revokedAt: null },
    { revokedAt: new Date() },
  );
}

export async function refresh(refreshTokenValue) {
  const payload = await verifyRefreshToken(refreshTokenValue);

  const storedToken = await RefreshToken.findOneAndUpdate(
    { token: refreshTokenValue, revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );
  if (!storedToken) return null;

  const context = await UserContext.findById(payload.contextId)
    .populate("profile")
    .populate("role");
  if (!context) return null;

  const user = await User.findById(payload.userId);
  if (!user) return null;

  const { accessToken, refreshToken } = await generateTokens(
    user,
    context,
    context.profile,
    context.role,
  );
  return { accessToken, refreshToken };
}

export async function getMe(userId, contextId) {
  const [user, context] = await Promise.all([
    User.findById(userId),
    UserContext.findById(contextId).populate("profile").populate("role").populate("shop"),
  ]);
  if (!user || !context) return null;
  return { user, context };
}
