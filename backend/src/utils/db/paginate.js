export async function paginate(
  model,
  { filter = {}, sort = { createdAt: -1 }, page = 1, limit = 10 } = {},
) {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    model.find(filter).sort(sort).skip(skip).limit(limit),
    model.countDocuments(filter),
  ]);
  return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}
