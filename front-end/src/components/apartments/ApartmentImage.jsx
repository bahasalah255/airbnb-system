import { useEffect, useState } from 'react'
import { apartmentFallbackImage, getApartmentPrimaryImage } from '../../utils/apartmentImages.js'

export default function ApartmentImage({ photos, alt, className = '', imageClassName = '' }) {
  const initialSrc = getApartmentPrimaryImage(photos)
  const [src, setSrc] = useState(initialSrc)

  useEffect(() => {
    setSrc(initialSrc)
  }, [initialSrc])

  return (
    <div className={className}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setSrc(apartmentFallbackImage)}
        className={imageClassName}
      />
    </div>
  )
}
