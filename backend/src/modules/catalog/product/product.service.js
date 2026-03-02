import Product from "./product.model.js";
import { paginate } from "#utils/db/paginate.js";
import { throwIfDuplicateKey } from "#utils/db/errors.js";
import { pickDefined } from "#utils/objects.js";
import { toggleActiveStatus } from "#utils/db/status.js";
import { uploadImages, addDocumentImages, removeDocumentImage } from "#utils/upload/cloudinary.js";
import { UPLOAD_FOLDERS } from "#utils/constants.js";
import { NotFoundError } from "#utils/http/errors.js";

export async function list({ shop, search, category, isActive, page, limit }) {
  const filter = { shop };
  if (search) filter.name = { $regex: search, $options: "i" };
  if (category) filter.category = category;
  if (isActive !== undefined) filter.isActive = isActive;

  return paginate(Product, {
    filter,
    page,
    limit,
    populate: { path: "category", select: "name" },
  });
}

export async function select(shop, search) {
  const filter = { shop, isActive: true };
  if (search) filter.name = { $regex: search, $options: "i" };
  return Product.find(filter).select("name").sort("name");
}

export async function getById(id, shop) {
  const product = await Product.findOne({ _id: id, shop }).populate("category", "name");
  if (!product) throw new NotFoundError(Product.modelName);
  return product;
}

export async function create({ name, description, price, stock, category, shop }, imageFiles) {
  try {
    let images = [];
    if (imageFiles?.length) {
      const results = await uploadImages(
        imageFiles.map(f => f.buffer),
        { folder: UPLOAD_FOLDERS.PRODUCTS },
      );
      images = results.map(r => r.url);
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      shop,
      images,
    });
    return product.populate("category", "name");
  } catch (error) {
    throwIfDuplicateKey(error, { name: "A product with this name already exists in your shop" });
  }
}

export async function update(id, shop, data) {
  const update = pickDefined(data, ["name", "description", "price", "stock", "category"]);

  try {
    const product = await Product.findOneAndUpdate({ _id: id, shop }, update, {
      new: true,
      runValidators: true,
    }).populate("category", "name");
    if (!product) throw new NotFoundError(Product.modelName);
    return product;
  } catch (error) {
    throwIfDuplicateKey(error, { name: "A product with this name already exists in your shop" });
  }
}

export async function toggleActive(id, shop) {
  return toggleActiveStatus(
    Product,
    { _id: id, shop },
    { populate: { path: "category", select: "name" } },
  );
}

export async function addImages(id, shop, imageFiles) {
  const product = await Product.findOne({ _id: id, shop });
  if (!product) throw new NotFoundError(Product.modelName);
  await addDocumentImages(product, imageFiles, UPLOAD_FOLDERS.PRODUCTS);
  return product.populate("category", "name");
}

export async function removeImage(id, shop, imageUrl) {
  const product = await Product.findOne({ _id: id, shop });
  if (!product) throw new NotFoundError(Product.modelName);
  await removeDocumentImage(product, imageUrl);
  return product.populate("category", "name");
}
