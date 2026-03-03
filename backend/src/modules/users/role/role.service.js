import Role from "./role.model.js";

export async function select() {
  const roles = await Role.find({ code: { $ne: "owner" } })
    .select("label")
    .lean();
  return roles.map(({ _id, label }) => ({ id: _id, name: label }));
}
