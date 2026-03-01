import UserContext from "#modules/users/userContext.model.js";
import Role from "#modules/users/role.model.js";
import { toggleActiveStatus } from "#utils/db/toggleActive.js";
import { NotFoundError, BadRequestError } from "#utils/http/errors.js";

const MEMBER_POPULATE = [
  { path: "user", select: "firstName lastName email avatarUrl" },
  { path: "role", select: "code label" },
];

async function findMember(memberId, shopId) {
  const context = await UserContext.findOne({ _id: memberId, shop: shopId }).populate("role");
  if (!context) throw new NotFoundError("Member not found");
  if (context.role?.code === "owner") throw new BadRequestError("Cannot modify the owner");
  return context;
}

export async function list(shopId) {
  return UserContext.find({ shop: shopId }).populate(MEMBER_POPULATE);
}

export async function update(memberId, shopId, { roleId }) {
  const context = await findMember(memberId, shopId);

  const role = await Role.findById(roleId);
  if (!role || role.code === "owner") throw new BadRequestError("Invalid role");

  context.role = role._id;
  await context.save();

  return UserContext.findById(context._id).populate(MEMBER_POPULATE);
}

export async function toggleActive(memberId, shopId) {
  await findMember(memberId, shopId);

  return toggleActiveStatus(UserContext, { _id: memberId }, { populate: MEMBER_POPULATE });
}

export async function remove(memberId, shopId) {
  const context = await findMember(memberId, shopId);
  await context.deleteOne();
}
