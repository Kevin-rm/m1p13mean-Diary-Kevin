export async function paginate(
  model,
  { filter = {}, sort = { createdAt: -1 }, page = 1, limit = 10, select, populate } = {},
) {
  const skip = (page - 1) * limit;
  let query = model.find(filter).sort(sort).skip(skip).limit(limit);
  if (select) query = query.select(select);
  if (populate) query = query.populate(populate);
  const [data, total] = await Promise.all([query, model.countDocuments(filter)]);
  return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}
