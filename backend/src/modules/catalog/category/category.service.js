import Category from "./category.model.js";
import { paginate } from "#utils/db/paginate.js";
import { throwIfDuplicateKey } from "#utils/db/errors.js";
import { pickDefined } from "#utils/objects.js";
import { toggleActiveStatus } from "#utils/db/toggleActive.js";

export async function list({ search, isActive, page, limit }) {
  const filter = {};
  if (search) filter.name = { $regex: search, $options: "i" };
  if (isActive !== undefined) filter.isActive = isActive;

  return paginate(Category, { filter, page, limit });
}

export async function select() {
  return Category.find({ isActive: true }).select("name").sort("name").lean();
}

export async function getById(id) {
  return Category.findById(id);
}

export async function create({ name, description }) {
  try {
    return await Category.create({ name, description });
  } catch (error) {
    throwIfDuplicateKey(error, { name: "Category name already exists" });
  }
}

export async function update(id, data) {
  const update = pickDefined(data, ["name", "description"]);

  try {
    return await Category.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  } catch (error) {
    throwIfDuplicateKey(error, { name: "Category name already exists" });
  }
}

export async function toggleActive(id) {
  return toggleActiveStatus(Category, id);
}
