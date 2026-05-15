type Locale = 'en' | 'ar'

export function localField(obj: Record<string, any>, field: string, locale: Locale): string {
  return obj[`${field}_${locale}`] ?? obj[`${field}_en`] ?? ''
}
