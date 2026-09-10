import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = new L.DivIcon({
  html: `<i class="fa-solid fa-location-dot" style="color: #FF7A59; font-size: 24px; filter: drop-shadow(0px 2px 2px rgba(0,0,0,0.3));"></i>`,
  className: 'custom-marker-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -20]
});

const poiIcon = new L.DivIcon({
  html: `<div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-md border-2 border-white"><i class="fa-solid fa-shop text-white text-xs"></i></div>`,
  className: 'custom-marker-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const vetIcon = new L.DivIcon({
  html: `<div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md border-2 border-white"><i class="fa-solid fa-stethoscope text-white text-xs"></i></div>`,
  className: 'custom-marker-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const NearbySearch = () => {
  const [radius, setRadius] = useState(20);
  const [coords, setCoords] = useState(null);
  const [ngos, setNgos] = useState([]);
  const [pois, setPois] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNearby = (lat, lng, r) => {
    setLoading(true);
    
    // Fetch NGOs from backend
    const fetchNgos = fetch(`http://localhost:8080/api/ngos/nearby?lat=${lat}&lng=${lng}&radius=${r}`)
      .then(res => res.json())
      .catch(err => {
        console.error("NGO fetch error:", err);
        return [];
      });

    // Fetch POIs (Pet shops, Vets, etc.) from Overpass API
    const overpassQuery = `
      [out:json];
      (
        node["shop"="pet"](around:${r * 1000},${lat},${lng});
        node["amenity"="veterinary"](around:${r * 1000},${lat},${lng});
      );
      out center;
    `;
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
    
    const fetchPoiData = fetch(overpassUrl)
      .then(res => res.json())
      .then(data => data.elements || [])
      .catch(err => {
        console.error("Overpass API Error:", err);
        return [];
      });

    Promise.all([fetchNgos, fetchPoiData]).then(([ngoData, poiData]) => {
        if (ngoData) setNgos(ngoData);
        if (poiData) setPois(poiData);
        setLoading(false);
    });
  };

  const handleFindNearby = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoords({ lat, lng });
          fetchNearby(lat, lng, radius);
        },
        (error) => {
          console.error("Error getting location: ", error);
          setLoading(false);
          alert("Could not get your location. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coords) {
      fetchNearby(coords.lat, coords.lng, radius);
    }
  }, [radius]);

  const getPoiIcon = (poi) => {
      if (poi.tags?.amenity === 'veterinary') return vetIcon;
      return poiIcon;
  };

  const getPoiType = (poi) => {
      if (poi.tags?.amenity === 'veterinary') return 'Veterinary Clinic';
      if (poi.tags?.shop === 'pet') return 'Pet Shop';
      return 'Pet Service';
  };

  return (
    <div className="bg-secondary p-6 rounded-2xl shadow-sm border border-gray-100 max-w-7xl mx-auto my-12 text-accent" id="ngos">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-heading font-extrabold text-accent">Find Nearby Services</h2>
        <p className="mt-3 text-gray-600 text-lg">Discover pet adoption centers, pet shops, and vets within your reach.</p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        
        <div className="flex-1 w-full flex flex-col md:flex-row items-center gap-4">
          <button 
            onClick={handleFindNearby}
            disabled={loading}
            className="w-full md:w-auto min-w-[200px] whitespace-nowrap bg-brand text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-dark transition shadow-lg relative flex items-center justify-center text-lg"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-white rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                Locating...
              </div>
            ) : (
              <span><i className="fa-solid fa-location-crosshairs mr-2"></i> Find Nearby</span>
            )}
          </button>
          
          <div className="flex-1 w-full relative">
            <div className={`h-16 border-2 rounded-xl flex items-center px-5 bg-gray-50 overflow-hidden transition-all duration-300 ${loading ? 'border-brand animate-pulse bg-brand/5 shadow-[0_0_15px_rgba(255,122,89,0.3)]' : 'border-gray-200'}`}>
              <i className={`fa-solid fa-magnifying-glass text-xl mr-4 ${loading ? 'text-brand animate-pulse' : 'text-gray-400'}`}></i>
              <span className={`text-lg ${loading ? 'text-brand font-medium' : 'text-gray-500'}`}>
                {loading ? "Searching for GPS signal..." : coords ? `Location active: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "Click 'Find Nearby' to start"}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="flex justify-between mb-2 text-sm font-bold text-accent">
            <span>Search Radius</span>
            <span className="text-brand">{radius} km</span>
          </div>
          <input 
            type="range" 
            min="5" 
            max="100" 
            step="5"
            value={radius} 
            onChange={(e) => setRadius(e.target.value)}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-brand mb-1"
          />
          <div className="flex justify-between text-xs text-gray-500 font-medium">
            <span>5km</span>
            <span>100km</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 relative z-0" style={{ height: '600px' }}>
        {coords ? (
          <MapContainer center={[coords.lat, coords.lng]} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            />
            {/* User Location */}
            <Marker position={[coords.lat, coords.lng]} icon={new L.DivIcon({
                html: `<div class="w-5 h-5 bg-blue-500 rounded-full border-[3px] border-white shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>`,
                className: '', iconSize: [20,20], iconAnchor: [10,10]
            })}>
              <Popup className="font-sans font-bold text-gray-700">You are here</Popup>
            </Marker>
            
            {/* Draw Radius Circle */}
            <Circle center={[coords.lat, coords.lng]} radius={radius * 1000} pathOptions={{ color: '#FF7A59', fillColor: '#FF7A59', fillOpacity: 0.08, weight: 2 }} />

            {/* NGO Markers */}
            {ngos.map(ngo => (
              <Marker key={ngo.id} position={[ngo.latitude, ngo.longitude]} icon={customIcon}>
                <Popup className="font-sans">
                  <div className="p-2 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                        <i className="fa-solid fa-building text-[#FF7A59] text-lg"></i>
                        <h3 className="font-heading font-extrabold text-accent text-lg leading-tight">{ngo.name}</h3>
                    </div>
                    <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Adoption Center</div>
                    
                    <p className="text-sm text-gray-700 mb-1 leading-tight">
                        <i className="fa-solid fa-map-pin mr-1 text-gray-400"></i> {ngo.address}
                    </p>
                    
                    {ngo.contactInfo && (
                        <p className="text-sm text-gray-700 mb-2 border-b border-gray-100 pb-2">
                            <i className="fa-solid fa-envelope mr-1 text-gray-400"></i> {ngo.contactInfo}
                        </p>
                    )}
                    
                    <div className="font-bold text-sm text-brand mb-2 mt-2"><i className="fa-solid fa-paw mr-1"></i> Available Pets ({ngo.pets?.length || 0})</div>
                    {ngo.pets?.length > 0 ? (
                      <ul className="text-sm space-y-1">
                        {ngo.pets?.slice(0,3).map(pet => (
                          <li key={pet.id} className="flex justify-between items-center text-gray-700 bg-gray-50 py-1 px-2 rounded">
                            <span className="font-semibold">{pet.name}</span>
                            <span className="text-xs text-gray-500">{pet.breed}</span>
                          </li>
                        ))}
                        {ngo.pets?.length > 3 && <li className="text-xs text-gray-500 italic text-center pt-1">+ {ngo.pets.length - 3} more</li>}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-500 italic">No pets currently available.</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* POI Markers */}
            {pois.map((poi, idx) => (
              <Marker key={`poi-${idx}`} position={[poi.lat, poi.lon]} icon={getPoiIcon(poi)}>
                <Popup className="font-sans">
                  <div className="p-2 min-w-[150px]">
                    <div className="flex items-center gap-2 mb-1">
                        <i className={`fa-solid ${poi.tags?.amenity === 'veterinary' ? 'fa-stethoscope text-green-500' : 'fa-shop text-blue-500'} text-lg`}></i>
                        <h3 className="font-heading font-extrabold text-accent text-base leading-tight">
                            {poi.tags?.name || "Unnamed " + getPoiType(poi)}
                        </h3>
                    </div>
                    <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">{getPoiType(poi)}</div>
                    
                    {(poi.tags?.['addr:full'] || poi.tags?.['addr:street'] || poi.tags?.['addr:city']) && (
                        <p className="text-sm text-gray-700 mb-2 leading-tight">
                            <i className="fa-solid fa-map-pin mr-1 text-gray-400"></i> 
                            {poi.tags?.['addr:full'] || [poi.tags?.['addr:housenumber'], poi.tags?.['addr:street'], poi.tags?.['addr:city'], poi.tags?.['addr:postcode']].filter(Boolean).join(', ')}
                        </p>
                    )}
                    
                    {poi.tags?.['contact:phone'] || poi.tags?.phone ? (
                        <p className="text-sm text-gray-700 mb-1"><i className="fa-solid fa-phone mr-1 text-gray-400"></i> {poi.tags?.['contact:phone'] || poi.tags?.phone}</p>
                    ) : null}
                    
                    {poi.tags?.website ? (
                        <p className="text-sm text-blue-500 hover:underline break-all"><i className="fa-solid fa-globe mr-1 text-gray-400"></i> <a href={poi.tags.website.startsWith('http') ? poi.tags.website : 'http://' + poi.tags.website} target="_blank" rel="noopener noreferrer">Website</a></p>
                    ) : null}

                    {poi.tags?.opening_hours ? (
                        <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-1 rounded"><i className="fa-regular fa-clock mr-1 text-gray-400"></i> {poi.tags.opening_hours}</p>
                    ) : null}
                  </div>
                </Popup>
              </Marker>
            ))}

          </MapContainer>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-8 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <i className="fa-solid fa-map-location-dot text-5xl text-gray-300"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-500 mb-2">Map View Inactive</h3>
            <p className="max-w-md text-gray-400">Click the "Find Nearby" button above and allow location access to discover adoption centers and pet services in your area.</p>
          </div>
        )}
      </div>
      
      {coords && (
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 text-sm font-medium text-gray-700">
                  <div className="w-3 h-3 rounded-full bg-[#FF7A59]"></div> NGOs / Adoption Centers
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 text-sm font-medium text-gray-700">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div> Pet Shops
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 text-sm font-medium text-gray-700">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div> Veterinary Clinics
              </div>
          </div>
      )}
    </div>
  );
};

export default NearbySearch;