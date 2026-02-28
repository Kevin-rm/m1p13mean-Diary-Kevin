import User from "#modules/users/user.model.js";
import UserContext from "#modules/users/userContext.model.js";
import Role from "#modules/users/role.model.js";
import Invitation from "./invitation.model.js";
import { err, success } from "#utils/objects.js";

export async function invite(shopId, { email, roleId }, invitedById) {
  const user = await User.findOne({ email });
  if (!user) return err("user_not_found");

  const existing = await UserContext.findOne({ user: user._id, shop: shopId });
  if (existing) return err("already_member");

  const pending = await Invitation.findOne({ shop: shopId, user: user._id, status: "pending" });
  if (pending) return err("already_invited");

  const role = await Role.findById(roleId);
  if (!role || role.code === "owner") return err("invalid_role");

  const invitation = await Invitation.create({
    shop: shopId,
    user: user._id,
    role: roleId,
    invitedBy: invitedById,
  });

  return success(invitation);
}

export async function listByShop(shopId) {
  return Invitation.find({ shop: shopId })
    .sort({ createdAt: -1 })
    .populate("user", "firstName lastName email")
    .populate("role", "code label");
}

export async function listByUser(userId) {
  return Invitation.find({ user: userId, status: "pending" })
    .sort({ createdAt: -1 })
    .populate("shop", "name")
    .populate("role", "code label")
    .populate("invitedBy", "firstName lastName");
}

export async function accept(invitationId, userId, session) {
  const invitation = await Invitation.findOne({
    _id: invitationId,
    user: userId,
    status: "pending",
  })
    .populate("role")
    .session(session);
  if (!invitation) return err("not_found");

  invitation.status = "accepted";
  await invitation.save({ session });
  return success(invitation);
}

export async function decline(invitationId, userId) {
  const invitation = await Invitation.findOne({
    _id: invitationId,
    user: userId,
    status: "pending",
  });
  if (!invitation) return err("not_found");

  invitation.status = "declined";
  await invitation.save();
  return success(invitation);
}

export async function cancel(invitationId, shopId) {
  const invitation = await Invitation.findOne({
    _id: invitationId,
    shop: shopId,
    status: "pending",
  });
  if (!invitation) return err("not_found");

  invitation.status = "cancelled";
  await invitation.save();
  return success(invitation);
}
