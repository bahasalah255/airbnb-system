import CardItem from './CardItem.jsx'

export default function CardGrid({ apartments, savedIds, onSave, onView }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {apartments.map((apartment) => (
        <CardItem
          key={apartment.id}
          apartment={apartment}
          onSave={onSave}
          isSaved={savedIds.has(apartment.id)}
          onView={onView}
        />
      ))}
    </div>
  )
}
