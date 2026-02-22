import User from "#modules/users/user.model.js";
import { uploadImage, deleteImage, extractPublicId } from "#utils/upload/cloudinary.js";

export async function updateProfile(userId, { firstName, lastName }) {
  return User.findByIdAndUpdate(userId, { firstName, lastName }, { new: true });
}

export async function updateAvatar(userId, file) {
  const user = await User.findById(userId);
  if (!user) return null;

  const { url } = await uploadImage(file.buffer, { folder: "avatars" });

  if (user.avatarUrl) {
    const oldPublicId = extractPublicId(user.avatarUrl);
    if (oldPublicId) deleteImage(oldPublicId).catch(() => {});
  }

  user.avatarUrl = url;
  await user.save();
  return user;
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
