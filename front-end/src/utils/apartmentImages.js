const fallbackSvg = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-label="Apartment placeholder">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" rx="36" fill="url(#g)" />
  <rect x="230" y="140" width="340" height="260" rx="24" fill="#ffffff" stroke="#cbd5e1" stroke-width="10" />
  <path d="M260 260 L400 180 L540 260" fill="none" stroke="#94a3b8" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" />
  <rect x="285" y="280" width="70" height="120" rx="10" fill="#dbeafe" />
  <rect x="445" y="280" width="70" height="120" rx="10" fill="#dbeafe" />
  <rect x="365" y="305" width="70" height="145" rx="12" fill="#cbd5e1" />
  <text x="400" y="485" font-family="Arial, sans-serif" font-size="28" text-anchor="middle" fill="#64748b">No image</text>
</svg>`)}`

function isValidApartmentImage(src) {
  return (
    typeof src === 'string' &&
    src.trim() !== '' &&
    (
      /^(https?:)?\/\//i.test(src) ||
      src.startsWith('/storage/') ||
      src.startsWith('/') ||
      src.startsWith('data:') ||
      src.startsWith('blob:')
    )
  )
}

export const apartmentFallbackImage = fallbackSvg

export function getApartmentImageList(photos) {
  if (!photos) return []

  if (Array.isArray(photos)) {
    return photos.filter((photo) => typeof photo === 'string' && photo.trim() !== '')
  }

  if (typeof photos === 'string') {
    return photos
      .split(',')
      .map((photo) => photo.trim())
      .filter(Boolean)
  }

  return []
}

export function getApartmentPrimaryImage(photos) {
  const image = getApartmentImageList(photos).find(isValidApartmentImage)
  return image ?? apartmentFallbackImage
}

export function getApartmentGallery(photos) {
  const images = getApartmentImageList(photos).filter(isValidApartmentImage)
  return images.length > 0 ? images : [apartmentFallbackImage]
}
