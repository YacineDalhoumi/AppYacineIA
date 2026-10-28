// Normalise un numéro pour comparaison (dédoublonnage import CSV / mock repo) :
// retire espaces, points, tirets, parenthèses, et convertit +33 en 0.
export function normalizePhone(value) {
  if (!value) return ''
  let digits = String(value).replace(/[\s.\-()]/g, '')
  if (digits.startsWith('+33')) digits = `0${digits.slice(3)}`
  else if (digits.startsWith('0033')) digits = `0${digits.slice(4)}`
  return digits
}

// Construit un lien tel: cliquable depuis un numéro (mobile prioritaire sur fixe).
export function telHref(phone) {
  const normalized = normalizePhone(phone)
  return normalized ? `tel:${normalized}` : null
}
