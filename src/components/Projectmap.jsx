import { useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  GeolocateControl,
} from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin, ChevronRight, Home, Bed, Bath, Maximize } from "lucide-react";

// RTL text support for Arabic
maplibregl.setRTLTextPlugin(
  "https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js",
  true,
);

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=60";

/* ===== Project Pin Marker ===== */
function ProjectPin({ name, count, isHovered, isActive }) {
  return (
    <div className="relative group cursor-pointer">
      {/* Pin body */}
      <div
        className={`
          relative flex items-center gap-1.5 px-3 py-2 rounded-full shadow-lg
          transition-all duration-300 ease-out
          ${
            isActive
              ? "bg-[var(--pcolor2)] text-white scale-110"
              : isHovered
                ? "bg-[var(--pcolor2)] text-white scale-105"
                : "bg-white text-[var(--pcolor2)] hover:scale-105"
          }
        `}
      >
        <MapPin
          className={`w-4 h-4 shrink-0 ${
            isActive || isHovered
              ? "text-[var(--pcolor1)]"
              : "text-[var(--pcolor1)]"
          }`}
          fill={isActive || isHovered ? "currentColor" : "none"}
        />
        <span className="text-xs font-semibold whitespace-nowrap max-w-[120px] truncate font-body">
          {name}
        </span>
        {count > 1 && (
          <span
            className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
              isActive || isHovered
                ? "bg-[var(--pcolor1)] text-white"
                : "bg-[var(--pcolor2)]/10 text-[var(--pcolor2)]"
            }`}
          >
            {count}
          </span>
        )}
      </div>

      {/* Pin tail */}
      <div className="flex justify-center">
        <div
          className={`w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent transition-colors duration-300 ${
            isActive || isHovered
              ? "border-t-[var(--pcolor2)]"
              : "border-t-white"
          }`}
        />
      </div>
    </div>
  );
}

/* ===== Popup Card ===== */
function PopupCard({ group, onUnitClick }) {
  const formatPrice = (p) => {
    if (!p) return "0";
    if (p >= 1000000) {
      const m = p / 1000000;
      return `${m % 1 === 0 ? m : m.toFixed(1)}M`;
    }
    if (p >= 1000) return `${(p / 1000).toFixed(0)}K`;
    return p.toLocaleString();
  };

  return (
    <div className="min-w-[260px] max-w-[300px] font-body">
      {/* Header */}
      <div className="mb-3 pb-3 border-b border-[#e5e0d8]">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[var(--pcolor1)] shrink-0" />
          <h3 className="font-display font-semibold text-[16px] text-[var(--pcolor2)] leading-tight">
            {group.locationName || "Project"}
          </h3>
        </div>
        <p className="text-[13px] text-[#6b7280] mt-1 ml-6">
          {group.units.length}{" "}
          {group.units.length === 1 ? "property" : "properties"} available
        </p>
      </div>

      {/* Units List */}
      <div className="space-y-1 max-h-[240px] overflow-y-auto no-scrollbar">
        {group.units.slice(0, 5).map((unit) => (
          <button
            key={unit._id}
            onClick={() => onUnitClick?.(unit)}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#f8f6f3] transition-all duration-200 text-left group"
          >
            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#f0ede8] shrink-0">
              <img
                src={unit.images?.[0] || DEFAULT_IMAGE}
                alt={unit.property_type}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = DEFAULT_IMAGE;
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[var(--pcolor2)] truncate">
                {unit.property_type}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-[#6b7280] mt-0.5">
                <span className="flex items-center gap-0.5">
                  <Bed className="w-3 h-3" />
                  {unit.bedrooms || 0}
                </span>
                <span className="flex items-center gap-0.5">
                  <Bath className="w-3 h-3" />
                  {unit.bathrooms || 0}
                </span>
                <span className="flex items-center gap-0.5">
                  <Maximize className="w-3 h-3" />
                  {unit.area_sqm || 0}m²
                </span>
              </div>
              <p className="text-[13px] font-bold text-[var(--pcolor1)] mt-1">
                EGP {formatPrice(unit.price)}
              </p>
            </div>

            {/* Arrow */}
            <ChevronRight className="w-4 h-4 text-[#d1ccc4] group-hover:text-[var(--pcolor1)] transition-colors shrink-0" />
          </button>
        ))}
      </div>

      {/* Show more */}
      {group.units.length > 5 && (
        <div className="mt-3 pt-3 border-t border-[#e5e0d8]">
          <p className="text-[12px] text-[#6b7280] text-center">
            +{group.units.length - 5} more properties
          </p>
        </div>
      )}
    </div>
  );
}

/* ===== Main Map Component ===== */
export default function PropertiesMapView({
  units = [],
  hoveredId,
  onMarkerClick,
}) {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [popupInfo, setPopupInfo] = useState(null);

  // Default viewport (Cairo, Egypt)
  const [viewState, setViewState] = useState({
    longitude: 31.2357,
    latitude: 30.0444,
    zoom: 10,
    pitch: 0,
    bearing: 0,
  });

  // Group units by project location
  const groupedUnits = useMemo(() => {
    const groups = {};
    units.forEach((unit) => {
      if (unit.project?.location?.coordinates) {
        const [lng, lat] = unit.project.location.coordinates;
        const key = `${lng.toFixed(4)},${lat.toFixed(4)}`;
        if (!groups[key]) {
          groups[key] = {
            lng,
            lat,
            locationName: unit.project.name || unit.project.location_name,
            units: [],
            minPrice: Infinity,
          };
        }
        groups[key].units.push(unit);
        if (unit.price < groups[key].minPrice) {
          groups[key].minPrice = unit.price;
        }
      }
    });
    return Object.values(groups);
  }, [units]);

  // Auto-fit bounds when units change
  useMemo(() => {
    if (groupedUnits.length === 0) return;

    if (groupedUnits.length === 1) {
      setViewState((prev) => ({
        ...prev,
        longitude: groupedUnits[0].lng,
        latitude: groupedUnits[0].lat,
        zoom: 13,
      }));
      return;
    }

    let minLng = Infinity,
      maxLng = -Infinity,
      minLat = Infinity,
      maxLat = -Infinity;
    groupedUnits.forEach((g) => {
      if (g.lng < minLng) minLng = g.lng;
      if (g.lng > maxLng) maxLng = g.lng;
      if (g.lat < minLat) minLat = g.lat;
      if (g.lat > maxLat) maxLat = g.lat;
    });

    const centerLng = (minLng + maxLng) / 2;
    const centerLat = (minLat + maxLat) / 2;
    const maxDiff = Math.max(maxLng - minLng, maxLat - minLat);
    let zoom = 10;
    if (maxDiff > 5) zoom = 6;
    else if (maxDiff > 2) zoom = 7;
    else if (maxDiff > 1) zoom = 8;
    else if (maxDiff > 0.5) zoom = 9;
    else if (maxDiff > 0.2) zoom = 10;
    else if (maxDiff > 0.1) zoom = 11;
    else zoom = 12;

    setViewState((prev) => ({
      ...prev,
      longitude: centerLng,
      latitude: centerLat,
      zoom,
    }));
  }, [groupedUnits]);

  const handleMarkerClick = useCallback((group) => {
    setPopupInfo(group);
  }, []);

  const handleUnitClick = useCallback(
    (unit) => {
      setPopupInfo(null);
      // Navigate to property details page
      navigate(`/property/${unit._id}`);
    },
    [navigate],
  );

  // Empty state
  if (units.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#f8f6f3] rounded-xl">
        <div className="w-20 h-20 mb-5 rounded-full bg-[#ede8e0] flex items-center justify-center">
          <MapPin className="w-9 h-9 text-[var(--pcolor1)]" />
        </div>
        <p className="text-[var(--pcolor2)] font-display font-semibold text-lg">
          No properties on map
        </p>
        <p className="text-[#6b7280] text-sm mt-1 font-body">
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={() => setPopupInfo(null)}
        mapStyle={MAP_STYLE}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
        reuseMaps
      >
        <NavigationControl position="bottom-right" showCompass={false} />
        <GeolocateControl
          position="bottom-right"
          trackUserLocation={false}
          showUserHeading={false}
        />

        {/* Project Pin Markers */}
        {groupedUnits.map((group, index) => {
          const isHovered = group.units.some((u) => u._id === hoveredId);
          const isActive =
            popupInfo?.lng === group.lng && popupInfo?.lat === group.lat;

          return (
            <Marker
              key={`${group.lng}-${group.lat}-${index}`}
              longitude={group.lng}
              latitude={group.lat}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(group);
              }}
            >
              <ProjectPin
                name={group.locationName}
                count={group.units.length}
                isHovered={isHovered}
                isActive={isActive}
              />
            </Marker>
          );
        })}

        {/* Popup */}
        {popupInfo && (
          <Popup
            longitude={popupInfo.lng}
            latitude={popupInfo.lat}
            anchor="bottom"
            onClose={() => setPopupInfo(null)}
            closeButton={true}
            closeOnClick={false}
            offset={[0, -40]}
            className="k-popup"
            maxWidth="320px"
          >
            <PopupCard group={popupInfo} onUnitClick={handleUnitClick} />
          </Popup>
        )}
      </Map>

      {/* Unit Count Badge */}
      <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-[#e5e0d8]">
        <span className="text-[13px] font-semibold text-[var(--pcolor2)] font-body">
          {groupedUnits.length}{" "}
          {groupedUnits.length === 1 ? "project" : "projects"} · {units.length}{" "}
          {units.length === 1 ? "unit" : "units"}
        </span>
      </div>
    </div>
  );
}
