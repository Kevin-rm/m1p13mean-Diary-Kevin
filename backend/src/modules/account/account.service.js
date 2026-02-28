import User from "#modules/users/user.model.js";
import { err, success } from "#utils/objects.js";
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
