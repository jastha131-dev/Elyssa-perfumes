// Reusable fragment for category fields
const categoryFragment = `
  _id,
  name,
  "slug": slug.current,
  description,
  image,
  order
`

// Reusable fragment for core product fields
const productFragment = `
  _id,
  "id": _id,
  name,
  "slug": slug.current,
  price,
  compareAtPrice,
  description,
  story,
  "images": images[]{
    "url": asset->url,
    alt
  },
  "category": category->{
    ${categoryFragment}
  },
  fragranceFamily,
  topNotes,
  middleNotes,
  baseNotes,
  intensity,
  sillage,
  longevity,
  volume,
  stock,
  featured,
  bestSeller,
  "new": new,
  tags,
  seoTitle,
  seoDescription
`

// ─── Product Queries ──────────────────────────────────────────────────────────

export const getAllProductsQuery = `
  *[_type == "product"] | order(_createdAt desc) {
    ${productFragment}
  }
`

export const getProductBySlugQuery = `
  *[_type == "product" && slug.current == $slug][0] {
    ${productFragment}
  }
`

export const getFeaturedProductsQuery = `
  *[_type == "product" && featured == true] | order(_createdAt desc) {
    ${productFragment}
  }
`

export const getBestSellerProductsQuery = `
  *[_type == "product" && bestSeller == true] | order(_createdAt desc) {
    ${productFragment}
  }
`

export const getNewProductsQuery = `
  *[_type == "product" && new == true] | order(_createdAt desc) {
    ${productFragment}
  }
`

export const getProductsByCategoryQuery = `
  *[_type == "product" && category->slug.current == $categorySlug] | order(_createdAt desc) {
    ${productFragment}
  }
`

export const getRelatedProductsQuery = `
  *[
    _type == "product" &&
    _id != $productId &&
    category->slug.current == $category
  ] | order(_createdAt desc) [0...$limit] {
    ${productFragment}
  }
`

export const searchProductsQuery = `
  *[
    _type == "product" && (
      name match $searchTerm ||
      description match $searchTerm ||
      fragranceFamily match $searchTerm ||
      $searchTerm in tags
    )
  ] | order(_createdAt desc) {
    ${productFragment}
  }
`

// ─── Category Queries ─────────────────────────────────────────────────────────

export const getAllCategoriesQuery = `
  *[_type == "category"] | order(order asc) {
    ${categoryFragment}
  }
`

// ─── Page Queries ─────────────────────────────────────────────────────────────

export const getHomePageQuery = `
  *[_type == "homePage"][0] {
    _id,
    "sections": sections[] {
      ...,
      "bgImageUrl": bgImage.asset->url,
      "bgImageAlt": bgImage.alt,
      "imageUrl": image.asset->url,
      "imageAlt": image.alt,
      "products": products[]->{
        _id,
        "id": _id,
        name,
        "slug": slug.current,
        price,
        compareAtPrice,
        description,
        "images": images[]{"url": asset->url, alt},
        "category": category->{ _id, name, "slug": slug.current },
        stock,
        featured,
        bestSeller,
        "new": new,
        fragranceFamily,
        topNotes,
        middleNotes,
        baseNotes,
        intensity,
        sillage,
        longevity,
        volume
      },
      "categories": categories[]->{
        _id,
        name,
        "slug": slug.current,
        description,
        image,
        order
      },
      "testimonials": testimonials[]->{
        _id,
        name,
        location,
        rating,
        review,
        "product": product->{ _id, name, "slug": slug.current }
      }
    }
  }
`

export const getTestimonialsQuery = `
  *[_type == "testimonial"] | order(_createdAt desc) {
    _id,
    name,
    location,
    rating,
    review,
    "product": product->{
      _id,
      name,
      "slug": slug.current
    }
  }
`
