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
  seoDescription_ar,
  concentration,
  ingredients,
  "shippingText_en": shippingText_en,
  "shippingText_ar": shippingText_ar,
  "layeringProducts": layeringProducts[]->{
    _id,
    "id": _id,
    name_en,
    name_ar,
    "slug": slug.current,
    price,
    compareAtPrice,
    fragranceFamily,
    concentration,
    "images": images[]{"url": asset->url, alt},
    "category": category->{ _id, name_en, name_ar, "slug": slug.current },
    stock,
    volume
  },
  "frequentlyBoughtTogether": frequentlyBoughtTogether[]->{
    _id,
    "id": _id,
    name_en,
    name_ar,
    "slug": slug.current,
    price,
    compareAtPrice,
    fragranceFamily,
    concentration,
    "images": images[]{"url": asset->url, alt},
    "category": category->{ _id, name_en, name_ar, "slug": slug.current },
    stock,
    volume
  },
  "reviews": reviews[]{
    _key,
    name,
    location,
    rating,
    review_en,
    review_ar,
    date,
    verified
  }
`

// ─── Product Queries ──────────────────────────────────────────────────────────

export const getAllProductsQuery = `
  *[_type == "product"] | order(_createdAt desc) {
    ${productFragment}
  }
`

export const getProductBySlugQuery = `
  *[_type == "product" && slug.current == $slug][0] {
    ${productFragment},
    "sections": sections[] {
      ...,
      "bgImageUrl": bgImage.asset->url,
      "bgImageAlt": bgImage.alt,
      "imageUrl": image.asset->url,
      "imageAlt": image.alt,
      "posterImageUrl": posterImage.asset->url,
      "videoFileUrl": videoFile.asset->url,
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
        intensity,
        sillage,
        longevity,
        volume
      },
      "faqs": faqs[]->{
        _id,
        question_en,
        question_ar,
        answer_en,
        answer_ar,
        category,
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
      },
      "photos": photos[]{"imageUrl": image.asset->url, "imageAlt": image.alt, caption_en, caption_ar, link},
      "beforeImageUrl": beforeImage.asset->url,
      "beforeImageAlt": beforeImage.alt,
      "afterImageUrl": afterImage.asset->url,
      "afterImageAlt": afterImage.alt
    }
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
      },
      "collections": collections[]->{
        _id,
        title_en,
        title_ar,
        "slug": slug.current,
        "imageUrl": image.asset->url,
        filterParam,
        order
      },
      "faqs": faqs[]->{
        _id,
        question_en,
        question_ar,
        answer_en,
        answer_ar,
        category,
        order
      },
      "newArrivalsProducts": select(
        _type == "newArrivalsSection" => *[_type == "product" && new == true] | order(_createdAt desc)[0..11]{
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
          intensity,
          sillage,
          longevity,
          volume
        }
      ),
      "posterImageUrl": posterImage.asset->url,
      "videoFileUrl": videoFile.asset->url,
      "photos": photos[]{"imageUrl": image.asset->url, "imageAlt": image.alt, caption_en, caption_ar, link},
      "tiles": tiles[]{_key, "imageUrl": image.asset->url, "imageAlt": image.alt, label_en, label_ar, href},
      "beforeImageUrl": beforeImage.asset->url,
      "beforeImageAlt": beforeImage.alt,
      "afterImageUrl": afterImage.asset->url,
      "afterImageAlt": afterImage.alt
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
      },
      "collections": collections[]->{
        _id,
        title_en,
        title_ar,
        "slug": slug.current,
        "imageUrl": image.asset->url,
        filterParam,
        order
      },
      "faqs": faqs[]->{
        _id,
        question_en,
        question_ar,
        answer_en,
        answer_ar,
        category,
        order
      },
      "newArrivalsProducts": select(
        _type == "newArrivalsSection" => *[_type == "product" && new == true] | order(_createdAt desc)[0..11]{
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
          intensity,
          sillage,
          longevity,
          volume
        }
      ),
      "posterImageUrl": posterImage.asset->url,
      "videoFileUrl": videoFile.asset->url,
      "photos": photos[]{"imageUrl": image.asset->url, "imageAlt": image.alt, caption_en, caption_ar, link},
      "tiles": tiles[]{_key, "imageUrl": image.asset->url, "imageAlt": image.alt, label_en, label_ar, href},
      "beforeImageUrl": beforeImage.asset->url,
      "beforeImageAlt": beforeImage.alt,
      "afterImageUrl": afterImage.asset->url,
      "afterImageAlt": afterImage.alt
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

export const getAnnouncementBarQuery = `
  *[_type == "announcementBar"][0] {
    _id,
    isEnabled,
    text_en,
    text_ar,
    bgColor,
    customBgColor,
    textColor,
    link,
    linkLabel_en,
    linkLabel_ar,
    dismissible
  }
`

export const getCollectionBySlugQuery = `
  *[_type == "collection" && slug.current == $slug && isActive != false][0] {
    _id,
    title_en,
    title_ar,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    "heroImageUrl": heroImage.asset->url,
    "heroImageAlt": heroImage.alt,
    headline_en,
    headline_ar,
    subtext_en,
    subtext_ar,
    "cta": ctaButton,
    filterType,
    smartFilters,
    defaultSort,
    filterParam,
    seoTitle_en,
    seoTitle_ar,
    seoDescription_en,
    seoDescription_ar,
    "manualProducts": manualProducts[]->{
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
      concentration,
      intensity,
      sillage,
      longevity,
      volume,
      tags
    },
    "sections": sections[] {
      ...,
      "bgImageUrl": bgImage.asset->url,
      "bgImageAlt": bgImage.alt,
      "imageUrl": image.asset->url,
      "imageAlt": image.alt,
      "posterImageUrl": posterImage.asset->url,
      "videoFileUrl": videoFile.asset->url,
      "products": products[]->{
        _id, "id": _id, name_en, name_ar, "slug": slug.current, price, compareAtPrice,
        "images": images[]{"url": asset->url, alt},
        "category": category->{ _id, name_en, name_ar, "slug": slug.current },
        stock, featured, bestSeller, "new": new, fragranceFamily, intensity, sillage, longevity, volume
      },
      "faqs": faqs[]->{_id, question_en, question_ar, answer_en, answer_ar, category, order},
      "collections": collections[]->{_id, title_en, title_ar, "slug": slug.current, "imageUrl": image.asset->url, filterParam, order},
      "photos": photos[]{"imageUrl": image.asset->url, "imageAlt": image.alt, caption_en, caption_ar, link}
    }
  }
`

export const getActivePromotionsQuery = `
  *[_type == "promotion" && isActive == true && (!defined(validFrom) || dateTime(validFrom) <= dateTime(now())) && (!defined(validUntil) || dateTime(validUntil) >= dateTime(now()))] {
    _id,
    name,
    isActive,
    code,
    type,
    discountValue,
    tiers,
    buyQuantity,
    getQuantity,
    minOrderValue,
    minQuantity,
    validFrom,
    validUntil,
    usageLimit,
    onePerCustomer,
    "applicableProducts": applicableProducts[]->{_id},
    label_en,
    label_ar,
    badgeText_en,
    badgeText_ar,
    cartMessage_en,
    cartMessage_ar,
    freeShippingThreshold
  }
`

export const getAboutPageQuery = `
  *[_type == "aboutPage"][0] {
    _id,
    heroHeadline_en, heroHeadline_ar,
    heroSubline_en, heroSubline_ar,
    heroEyebrow_en, heroEyebrow_ar,
    "heroBgImageUrl": heroBgImage.asset->url,
    stats,
    philosophyHeadline_en, philosophyHeadline_ar,
    philosophyBody_en, philosophyBody_ar,
    pillars,
    timeline,
    ctaHeadline_en, ctaHeadline_ar,
    ctaBody_en, ctaBody_ar,
    ctaPrimary, ctaSecondary,
    seoTitle_en, seoTitle_ar,
    seoDescription_en, seoDescription_ar,
    "sections": sections[] {
      ...,
      "bgImageUrl": bgImage.asset->url,
      "bgImageAlt": bgImage.alt,
      "imageUrl": image.asset->url,
      "imageAlt": image.alt,
      "posterImageUrl": posterImage.asset->url,
      "photos": photos[]{"imageUrl": image.asset->url, "imageAlt": image.alt, caption_en, caption_ar, link},
      "testimonials": testimonials[]->{
        _id, name_en, name_ar, location_en, location_ar, rating, review_en, review_ar,
        "product": product->{ _id, name_en, name_ar, "slug": slug.current }
      }
    }
  }
`

// ─── Article Queries ──────────────────────────────────────────────────────────

export const getArticlesQuery = `
  *[_type == "article"] | order(publishedAt desc) {
    _id,
    title_en, title_ar,
    "slug": slug.current,
    category,
    excerpt_en, excerpt_ar,
    "coverImageUrl": coverImage.asset->url,
    "coverImageAlt": coverImage.alt,
    readTime,
    publishedAt,
    featured
  }
`

export const getArticleBySlugQuery = `
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title_en, title_ar,
    "slug": slug.current,
    category,
    excerpt_en, excerpt_ar,
    "coverImageUrl": coverImage.asset->url,
    "coverImageAlt": coverImage.alt,
    body_en, body_ar,
    readTime,
    publishedAt,
    featured,
    seoTitle_en, seoTitle_ar,
    seoDescription_en, seoDescription_ar
  }
`

export const getSiteSettingsQuery = `
  *[_type == "siteSettings"][0] {
    fontPairing,
    baseFontSize,
    headingLetterSpacing,
    bodyLineHeight,
    headingWeight,
    colorPalette,
    defaultCurrency,
    "currencies": currencies[isEnabled == true]{
      code,
      symbol,
      rate,
      position
    }
  }
`

export const getSmartCollectionProductsQuery = `
  *[
    _type == "product"
    && (!defined($fragranceFamilies) || count($fragranceFamilies) == 0 || fragranceFamily in $fragranceFamilies)
    && (!defined($tags) || count($tags) == 0 || count((tags)[@ in $tags]) > 0)
    && (!defined($priceMin) || price >= $priceMin)
    && (!defined($priceMax) || price <= $priceMax)
    && ($featured == false || featured == true)
    && ($bestSeller == false || bestSeller == true)
    && ($new == false || new == true)
  ] | order(_createdAt desc) {
    _id,
    "id": _id,
    name_en,
    name_ar,
    "slug": slug.current,
    price,
    compareAtPrice,
    "images": images[]{"url": asset->url, alt},
    "category": category->{ _id, name_en, name_ar, "slug": slug.current },
    stock,
    featured,
    bestSeller,
    "new": new,
    fragranceFamily,
    concentration,
    intensity,
    sillage,
    longevity,
    volume,
    tags
  }
`
