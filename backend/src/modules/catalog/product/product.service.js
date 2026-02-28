import Product from "./product.model.js";
import { paginate } from "#utils/db/paginate.js";
import { throwIfDuplicateKey } from "#utils/db/errors.js";
import { pickDefined, err, success } from "#utils/objects.js";
import { toggleActiveStatus } from "#utils/db/toggleActive.js";
import {
  uploadImages,
  deleteImage,
  extractPublicId,
  UPLOAD_FOLDERS,
} from "#utils/upload/cloudinary.js";

export async function listProducts({ shop, search, category, isActive, page, limit }) {
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

export async function getProductById(id, shop) {
  return Product.findOne({ _id: id, shop }).populate("category", "name");
}

export async function createProduct({ name, description, price, category, shop }, imageFiles) {
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
      stock: 0,
      category,
      shop,
      images,
    });
    return product.populate("category", "name");
  } catch (error) {
    throwIfDuplicateKey(error, { name: "A product with this name already exists in your shop" });
  }
}

export async function updateProduct(id, shop, data) {
  const update = pickDefined(data, ["name", "description", "price", "category"]);

  try {
    return await Product.findOneAndUpdate({ _id: id, shop }, update, {
      new: true,
      runValidators: true,
    }).populate("category", "name");
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
  if (!product) return err("not_found");

  const results = await uploadImages(
    imageFiles.map(f => f.buffer),
    { folder: UPLOAD_FOLDERS.PRODUCTS },
  );
  product.images.push(...results.map(r => r.url));
  await product.save();
  return success(await product.populate("category", "name"));
}

export async function removeImage(id, shop, imageUrl) {
  const product = await Product.findOne({ _id: id, shop });
  if (!product) return err("not_found");

  const imageIndex = product.images.indexOf(imageUrl);
  if (imageIndex === -1) return err("image_not_found");

  const publicId = extractPublicId(imageUrl);
  if (publicId) await deleteImage(publicId);

  product.images.splice(imageIndex, 1);
  await product.save();
  return success(await product.populate("category", "name"));
}
