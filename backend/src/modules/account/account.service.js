import User from "#modules/users/user.model.js";

export async function updateProfile(userId, { firstName, lastName, avatarUrl }) {
  const update = { firstName, lastName };
  if (avatarUrl !== undefined) update.avatarUrl = avatarUrl || null;
  return User.findByIdAndUpdate(userId, update, { new: true });
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
