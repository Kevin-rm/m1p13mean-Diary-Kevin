import Category from "./category.model.js";
import { paginate } from "#utils/db/paginate.js";
import { throwIfDuplicateKey } from "#utils/db/errors.js";
import { pickDefined } from "#utils/objects.js";

export async function listCategories({ search, isActive, page, limit }) {
  const filter = {};
  if (search) filter.name = { $regex: search, $options: "i" };
  if (isActive !== undefined) filter.isActive = isActive;

  return paginate(Category, { filter, page, limit });
}

export async function getCategoryById(id) {
  return Category.findById(id);
}

export async function createCategory({ name, description }) {
  try {
    return await Category.create({ name, description });
  } catch (error) {
    throwIfDuplicateKey(error, { name: "Category name already exists" });
  }
}

export async function updateCategory(id, data) {
  const update = pickDefined(data, ["name", "description"]);

  try {
    return await Category.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  } catch (error) {
    throwIfDuplicateKey(error, { name: "Category name already exists" });
  }
}

export async function toggleActive(id) {
  const category = await Category.findById(id);
  if (!category) return null;

  category.isActive = !category.isActive;
  await category.save();
  return category;
}
