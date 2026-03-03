import User from "#modules/users/user.model.js";
import UserContext from "#modules/users/userContext.model.js";
import Role from "#modules/users/role/role.model.js";
import Invitation from "./invitation.model.js";
import { transitionStatus } from "#utils/db/status.js";
import { NotFoundError, BadRequestError } from "#utils/http/errors.js";

export async function invite(shopId, { email, roleId }, invitedById) {
  const user = await User.findOne({ email });
  if (!user) throw new NotFoundError(User.modelName);

  const existing = await UserContext.findOne({ user: user._id, shop: shopId });
  if (existing) throw new BadRequestError("User is already a member");

  const pending = await Invitation.findOne({ shop: shopId, user: user._id, status: "pending" });
  if (pending) throw new BadRequestError("Invitation already pending");

  const role = await Role.findById(roleId);
  if (!role || role.code === "owner") throw new BadRequestError("Invalid role");

  return Invitation.create({
    shop: shopId,
    user: user._id,
    role: roleId,
    invitedBy: invitedById,
  });
}

export async function listByShop(shopId) {
  return Invitation.find({ shop: shopId, status: "pending" })
    .sort({ createdAt: -1 })
    .populate("user", "firstName lastName email avatarUrl")
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
  return transitionStatus(Invitation, {
    filter: { _id: invitationId, user: userId, status: "pending" },
    toStatus: "accepted",
    populate: "role",
    session,
  });
}

export async function decline(invitationId, userId) {
  return transitionStatus(Invitation, {
    filter: { _id: invitationId, user: userId, status: "pending" },
    toStatus: "declined",
  });
}

export async function cancel(invitationId, shopId) {
  return transitionStatus(Invitation, {
    filter: { _id: invitationId, shop: shopId, status: "pending" },
    toStatus: "cancelled",
  });
}
