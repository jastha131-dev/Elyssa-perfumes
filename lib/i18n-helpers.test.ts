import { localField } from './i18n-helpers'

describe('localField', () => {
  const obj = { name_en: 'Rose Oud', name_ar: 'ورد العود' }

  it('returns _ar field when locale is ar', () => {
    expect(localField(obj, 'name', 'ar')).toBe('ورد العود')
  })

  it('returns _en field when locale is en', () => {
    expect(localField(obj, 'name', 'en')).toBe('Rose Oud')
  })

  it('falls back to _en when _ar is missing', () => {
    const partial = { name_en: 'Rose Oud' }
    expect(localField(partial, 'name', 'ar')).toBe('Rose Oud')
  })

  it('returns empty string when both are missing', () => {
    expect(localField({}, 'name', 'ar')).toBe('')
  })
})
