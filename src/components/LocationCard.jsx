
function LocationCard({ location, onSelect}) {
  return (
    <button
      className="location-card"
      key={location.id}
      onClick={() => onSelect(location)}
    >
      <p>
        {location.name}
        {location.admin1 && `, ${location.admin1}`} 
        {location.country && `,${location.country}`}
      </p>
      <p>{location.latitude}, {location.longitude}</p>

    </button>
  );
}

export default LocationCard