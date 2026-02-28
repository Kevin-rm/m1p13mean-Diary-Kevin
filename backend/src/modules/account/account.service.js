import User from "#modules/users/user.model.js";
import Profile from "#modules/users/profile.model.js";
import UserContext from "#modules/users/userContext.model.js";
import * as invitationService from "#modules/shops/members/invitations/invitation.service.js";
import { generateTokens } from "#modules/auth/auth.service.js";
import { err, success } from "#utils/objects.js";
import { withTransaction } from "#utils/db/withTransaction.js";
import { replaceDocumentImage } from "#utils/upload/cloudinary.js";
import { UPLOAD_FOLDERS } from "#utils/constants.js";

export async function updateProfile(userId, { firstName, lastName }) {
  return User.findByIdAndUpdate(userId, { firstName, lastName }, { new: true });
}

export async function updateAvatar(userId, file) {
  const user = await User.findById(userId);
  if (!user) return null;

  return replaceDocumentImage(user, "avatarUrl", file, UPLOAD_FOLDERS.AVATARS);
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await User.findById(userId).select("+password");
  if (!user) return err("not_found");

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) return err("wrong_password");

  user.password = newPassword;
  await user.save();
  return success();
}

export async function listInvitations(userId) {
  return invitationService.listByUser(userId);
}

export async function acceptInvitation(invitationId, userId) {
  return withTransaction(async session => {
    const result = await invitationService.accept(invitationId, userId, session);
    if (result.error) return result;

    const invitation = result.data;

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

    return success({ user, context, accessToken, refreshToken });
  });
}

export async function declineInvitation(invitationId, userId) {
  return invitationService.decline(invitationId, userId);
}
