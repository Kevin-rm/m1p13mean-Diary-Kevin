import cloudinary from "#config/cloudinary.js";

const ROOT_FOLDER = "mallhub";
const UPLOAD_SEGMENT = "/upload/";

export const UPLOAD_FOLDERS = Object.freeze({
  AVATARS: "avatars",
  SHOP_LOGOS: "shop-logos",
  SHOP_IMAGES: "shop-images",
  PRODUCTS: "products",
});

function uploadToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
}

export async function uploadImage(buffer, { folder }) {
  const result = await uploadToCloudinary(buffer, {
    folder: `${ROOT_FOLDER}/${folder}`,
    resource_type: "image",
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function uploadImages(buffers, { folder }) {
  return Promise.all(buffers.map(buffer => uploadImage(buffer, { folder })));
}

export async function deleteImage(publicId) {
  return cloudinary.uploader.destroy(publicId);
}

export async function deleteImages(publicIds) {
  return Promise.all(publicIds.map(deleteImage));
}

export function extractPublicId(cloudinaryUrl) {
  const uploadIndex = cloudinaryUrl.indexOf(UPLOAD_SEGMENT);
  if (uploadIndex === -1) return null;

  return cloudinaryUrl
    .slice(uploadIndex + UPLOAD_SEGMENT.length)
    .replace(/^v\d+\//, "")
    .replace(/\.[^.]+$/, "");
}

export async function replaceDocumentImage(doc, field, file, folder) {
  const { url } = await uploadImage(file.buffer, { folder });

  const oldUrl = doc[field];
  if (oldUrl) {
    const oldPublicId = extractPublicId(oldUrl);
    if (oldPublicId) deleteImage(oldPublicId).catch(() => {});
  }

  doc[field] = url;
  await doc.save();
  return doc;
}
