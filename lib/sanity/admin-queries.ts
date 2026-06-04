// lib/sanity/admin-queries.ts

export const getAllOrdersAdminQuery = `
  *[_type == "order"] | order(placedAt desc) {
    _id,
    total,
    subtotal,
    discount,
    shipping,
    status,
    placedAt,
    "items": items[]{
      productId,
      productName,
      quantity,
      price,
      ml
    }
  }
`

export const getAllProductsAdminQuery = `
  *[_type == "product"] | order(stock asc) {
    _id,
    name_en,
    "slug": slug.current,
    stock,
    price,
    "category": category->name_en
  }
`

export const getUserStatsQuery = `
  {
    "total": count(*[_type == "user"]),
    "newThisMonth": count(*[_type == "user" && dateTime(createdAt) >= dateTime($startOfMonth)])
  }
`
