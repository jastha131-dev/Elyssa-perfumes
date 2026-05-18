// Reusable fragment for category fields
const categoryFragment = `
  _id,
  name_en,
  name_ar,
  "slug": slug.current,
  description_en,
  description_ar,
  image,
  order,
  "subcategories": subcategories[]->{
    _id,
    name_en,
    name_ar,
    "slug": slug.current,
    image
  }
`

// Reusable fragment for core product fields
const productFragment = `
  _id,
  "id": _id,
  name_en,
  name_ar,
  "slug": slug.current,
  price,
  compareAtPrice,
  description_en,
  description_ar,
  story_en,
  story_ar,
  "images": images[]{
    "url": asset->url,
    alt
  },
  "category": category->{
    ${categoryFragment}
  },
  fragranceFamily,
  topNotes_en,
  topNotes_ar,
  middleNotes_en,
  middleNotes_ar,
  baseNotes_en,
  baseNotes_ar,
  intensity,
  sillage,
  longevity,
  volume,
  stock,
  featured,
  bestSeller,
  "new": new,
  tags,
  seoTitle_en,
  seoTitle_ar,
  seoDescription_en,
  seoDescription_ar
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
      name_en match $searchTerm ||
      name_ar match $searchTerm ||
      description_en match $searchTerm ||
      description_ar match $searchTerm ||
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
        name_en,
        name_ar,
        "slug": slug.current,
        price,
        compareAtPrice,
        description_en,
        description_ar,
        "images": images[]{"url": asset->url, alt},
        "category": category->{ _id, name_en, name_ar, "slug": slug.current },
        stock,
        featured,
        bestSeller,
        "new": new,
        fragranceFamily,
        topNotes_en,
        topNotes_ar,
        middleNotes_en,
        middleNotes_ar,
        baseNotes_en,
        baseNotes_ar,
        intensity,
        sillage,
        longevity,
        volume
      },
      "categories": categories[]->{
        _id,
        name_en,
        name_ar,
        "slug": slug.current,
        description_en,
        description_ar,
        image,
        order
      },
      "testimonials": testimonials[]->{
        _id,
        name_en,
        name_ar,
        location_en,
        location_ar,
        rating,
        review_en,
        review_ar,
        "product": product->{ _id, name_en, name_ar, "slug": slug.current }
      }
    }
  }
`

// ─── Dynamic Page Queries ─────────────────────────────────────────────────────

export const getNavPagesQuery = `
  *[_type == "page" && showInNav == true] | order(navOrder asc) {
    _id,
    title_en,
    title_ar,
    "slug": slug.current,
    navOrder
  }
`

export const getPageBySlugQuery = `
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title_en,
    title_ar,
    "slug": slug.current,
    showInNav,
    navOrder,
    "sections": sections[] {
      ...,
      "bgImageUrl": bgImage.asset->url,
      "bgImageAlt": bgImage.alt,
      "imageUrl": image.asset->url,
      "imageAlt": image.alt,
      "products": products[]->{
        _id,
        "id": _id,
        name_en,
        name_ar,
        "slug": slug.current,
        price,
        compareAtPrice,
        description_en,
        description_ar,
        "images": images[]{"url": asset->url, alt},
        "category": category->{ _id, name_en, name_ar, "slug": slug.current },
        stock,
        featured,
        bestSeller,
        "new": new,
        fragranceFamily,
        topNotes_en,
        topNotes_ar,
        middleNotes_en,
        middleNotes_ar,
        baseNotes_en,
        baseNotes_ar,
        intensity,
        sillage,
        longevity,
        volume
      },
      "categories": categories[]->{
        _id,
        name_en,
        name_ar,
        "slug": slug.current,
        description_en,
        description_ar,
        image,
        order
      },
      "testimonials": testimonials[]->{
        _id,
        name_en,
        name_ar,
        location_en,
        location_ar,
        rating,
        review_en,
        review_ar,
        "product": product->{ _id, name_en, name_ar, "slug": slug.current }
      }
    }
  }
`

export const getCollectionsQuery = `
  *[_type == "collection" && showInTiles == true] | order(order asc) {
    _id,
    title_en,
    title_ar,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    filterParam,
    showInTiles,
    order
  }
`

export const getTestimonialsQuery = `
  *[_type == "testimonial"] | order(_createdAt desc) {
    _id,
    name_en,
    name_ar,
    location_en,
    location_ar,
    rating,
    review_en,
    review_ar,
    "product": product->{
      _id,
      name_en,
      name_ar,
      "slug": slug.current
    }
  }
`

export const getFaqItemsQuery = `
  *[_type == "faqItem"] | order(category asc, order asc) {
    _id, question_en, question_ar, answer_en, answer_ar, category, order
  }
`

export const getContactPageQuery = `
  *[_type == "contactPage"][0] {
    _id, heading_en, heading_ar, subtext_en, subtext_ar,
    email, phone, address_en, address_ar, instagramUrl, whatsappNumber
  }
`

export const getNavConfigQuery = `
  *[_type == "navConfig"][0] {
    "items": items[] {
      _key, label_en, label_ar, href, highlight, visible
    }
  }
`
