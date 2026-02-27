import User from "#modules/users/user.model.js";
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
  if (!user) return null;

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) return null;

  user.password = newPassword;
  await user.save();
  return user;
}
