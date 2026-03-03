import User from "#modules/users/user.model.js";
import Profile from "#modules/users/profile.model.js";
import UserContext from "#modules/users/userContext.model.js";
import * as invitationService from "#modules/shops/members/invitations/invitation.service.js";
import { generateTokens } from "#modules/auth/auth.service.js";
import { NotFoundError, BadRequestError } from "#utils/http/errors.js";
import { withTransaction } from "#utils/db/withTransaction.js";
import { replaceDocumentImage } from "#utils/upload/cloudinary.js";
import { UPLOAD_FOLDERS } from "#utils/constants.js";

export async function updateProfile(userId, { firstName, lastName }) {
  const user = await User.findByIdAndUpdate(userId, { firstName, lastName }, { new: true });
  if (!user) throw new NotFoundError(User.modelName);
  return user;
}

export async function updateAvatar(userId, file) {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError(User.modelName);

  return replaceDocumentImage(user, "avatarUrl", file, UPLOAD_FOLDERS.AVATARS);
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await User.findById(userId).select("+password");
  if (!user) throw new NotFoundError(User.modelName);

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new BadRequestError("Current password is incorrect");

  user.password = newPassword;
  await user.save();
}

export async function listInvitations(userId) {
  return invitationService.listByUser(userId);
}

export async function acceptInvitation(invitationId, userId) {
  return withTransaction(async session => {
    const invitation = await invitationService.accept(invitationId, userId, session);

    const shopProfile = await Profile.findOne({ code: "shop" }).session(session);
    if (!shopProfile) throw new Error("Shop profile not found. Database may not be seeded.");

    const [context] = await UserContext.create(
      [
        {
          user: userId,
          profile: shopProfile._id,
          role: invitation.role._id,
          shop: invitation.shop,
        },
      ],
      { session },
    );

    const user = await User.findById(userId).session(session);
    const { accessToken, refreshToken } = await generateTokens(
      user,
      context,
      shopProfile,
      invitation.role,
      session,
    );

    return { user, context, accessToken, refreshToken };
  });
}

export async function declineInvitation(invitationId, userId) {
  return invitationService.decline(invitationId, userId);
}
