export function formatCurrency(value, locale = 'en-US', currency = 'USD') {
  if (value === null || value === undefined || isNaN(value)) return '0'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatKHR(value) {
  if (!value && value !== 0) return '0 ៛'
  return new Intl.NumberFormat('km-KH').format(value) + ' ៛'
}

export function formatCurrencyNoSymbol(value, locale = 'en-US') {
  if (value === null || value === undefined || isNaN(value)) return '0.00'
  return new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}