import { useEffect, useMemo, useRef, useState } from 'react'
import ApartmentImage from './ApartmentImage.jsx'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ACCEPTED_LABEL = 'JPG, PNG or WEBP'

export default function ApartmentImageUpload({
  existingPhotos = [],
  selectedFiles = [],
  onExistingPhotosChange,
  onSelectedFilesChange,
  maxFiles = 5,
}) {
  const inputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)

  const previews = useMemo(
    () =>
      selectedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [selectedFiles],
  )

  useEffect(() => () => previews.forEach((preview) => URL.revokeObjectURL(preview.url)), [previews])

  const totalCount = existingPhotos.length + selectedFiles.length
  const remainingSlots = Math.max(0, maxFiles - totalCount)

  function normalizeFiles(fileList) {
    return Array.from(fileList ?? [])
      .filter((file) => ACCEPTED_TYPES.includes(file.type))
      .slice(0, remainingSlots)
  }

  function handleFiles(fileList) {
    const files = normalizeFiles(fileList)
    if (files.length === 0) {
      return
    }

    onSelectedFilesChange([...selectedFiles, ...files])
  }

  function handleRemoveExisting(index) {
    onExistingPhotosChange(existingPhotos.filter((_, currentIndex) => currentIndex !== index))
  }

  function handleRemoveFile(index) {
    onSelectedFilesChange(selectedFiles.filter((_, currentIndex) => currentIndex !== index))
  }

  function handleDrop(event) {
    event.preventDefault()
    setDragActive(false)
    handleFiles(event.dataTransfer.files)
  }

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onDragEnter={() => setDragActive(true)}
        onDragOver={(event) => {
          event.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-[1.4rem] border-2 border-dashed px-5 py-8 text-center transition ${
          dragActive ? 'border-sky-400 bg-sky-50/80' : 'border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-white'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
        <p className="text-sm font-semibold text-slate-900">Click or drag images here</p>
        <p className="mt-1 text-sm text-slate-500">
          Add up to {maxFiles} images. Accepted formats: {ACCEPTED_LABEL}.
        </p>
        <p className="mt-2 text-xs text-slate-400">Current selection: {totalCount}/{maxFiles}</p>
      </div>

      {(existingPhotos.length > 0 || previews.length > 0) && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {existingPhotos.map((photo, index) => (
            <div key={`${photo}-${index}`} className="group relative overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white shadow-[0_14px_30px_-26px_rgba(15,23,42,0.5)]">
              <ApartmentImage
                photos={[photo]}
                alt={`Existing apartment image ${index + 1}`}
                className="h-40 w-full"
                imageClassName="h-40 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              />
              <button
                type="button"
                onClick={() => handleRemoveExisting(index)}
                className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-slate-950/70 text-sm font-semibold text-white transition hover:bg-slate-950"
                aria-label="Remove image"
              >
                ×
              </button>
              <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-600">
                Saved
              </div>
            </div>
          ))}

          {previews.map((preview, index) => (
            <div key={`${preview.file.name}-${index}`} className="group relative overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white shadow-[0_14px_30px_-26px_rgba(15,23,42,0.5)]">
              <ApartmentImage
                photos={[preview.url]}
                alt={preview.file.name}
                className="h-40 w-full"
                imageClassName="h-40 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              />
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-slate-950/70 text-sm font-semibold text-white transition hover:bg-slate-950"
                aria-label="Remove selected image"
              >
                ×
              </button>
              <div className="absolute bottom-3 left-3 rounded-full bg-slate-900/90 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white">
                New
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
