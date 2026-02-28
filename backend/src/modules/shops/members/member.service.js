import UserContext from "#modules/users/userContext.model.js";
import Role from "#modules/users/role.model.js";
import { toggleActiveStatus } from "#utils/db/toggleActive.js";
import { err, success } from "#utils/objects.js";

const MEMBER_POPULATE = [
  { path: "user", select: "firstName lastName email avatarUrl" },
  { path: "role", select: "code label" },
];

async function findMember(memberId, shopId) {
  const context = await UserContext.findOne({ _id: memberId, shop: shopId }).populate("role");
  if (!context) return err("not_found");
  if (context.role?.code === "owner") return err("owner_protected");
  return success(context);
}

export async function list(shopId) {
  return UserContext.find({ shop: shopId }).populate(MEMBER_POPULATE);
}

export async function update(memberId, shopId, { roleId }) {
  const result = await findMember(memberId, shopId);
  if (result.error) return result;

  const role = await Role.findById(roleId);
  if (!role || role.code === "owner") return err("invalid_role");

  const context = result.data;
  context.role = role._id;
  await context.save();

  const updated = await UserContext.findById(context._id).populate(MEMBER_POPULATE);
  return success(updated);
}

export async function toggleActive(memberId, shopId) {
  const result = await findMember(memberId, shopId);
  if (result.error) return result;

  const updated = await toggleActiveStatus(
    UserContext,
    { _id: memberId },
    { populate: MEMBER_POPULATE },
  );
  return success(updated);
}

export async function remove(memberId, shopId) {
  const result = await findMember(memberId, shopId);
  if (result.error) return result;

  await result.data.deleteOne();
  return success();
}
