import { useState } from "react";
import { Heart, Star, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

export default function PropertyCard({ property, onClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const images =
    property?.images?.length > 0 ? property.images : [DEFAULT_IMAGE];

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const goPrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setImageLoaded(false);
  };

  const goNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setImageLoaded(false);
  };

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) >= 50) {
      if (distance > 0) {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
      setImageLoaded(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "0";
    if (price >= 1000000) {
      const m = price / 1000000;
      return m % 1 === 0 ? `${m}M` : `${m.toFixed(1)}M`;
    }
    if (price >= 1000) return `${(price / 1000).toFixed(0)}K`;
    return price.toLocaleString();
  };

  // Dots (max 5)
  const renderDots = () => {
    if (images.length <= 1) return null;
    const maxDots = 5;
    const total = images.length;
    let start = 0;
    if (total > maxDots) {
      start = Math.max(0, Math.min(currentIndex - 2, total - maxDots));
    }
    const visibleCount = Math.min(total, maxDots);

    return (
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-[5px]">
        {Array.from({ length: visibleCount }).map((_, i) => {
          const idx = start + i;
          const isActive = idx === currentIndex;
          const isEdge =
            total > maxDots &&
            ((i === 0 && start > 0) ||
              (i === visibleCount - 1 && start + visibleCount < total));

          return (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
                setImageLoaded(false);
              }}
              className={`rounded-full transition-all duration-200 ${
                isActive
                  ? "w-[6px] h-[6px] bg-white"
                  : isEdge
                    ? "w-[4px] h-[4px] bg-white/50"
                    : "w-[5px] h-[5px] bg-white/70"
              }`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div onClick={onClick} className="group cursor-pointer">
      {/* Image */}
      <div
        className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {!imageLoaded && <div className="absolute inset-0 img-loading" />}
        <img
          src={images[currentIndex]}
          alt={property?.property_type || "Property"}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.03] ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = DEFAULT_IMAGE;
            setImageLoaded(true);
          }}
          draggable={false}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
            >
              <ChevronLeft className="w-4 h-4 text-[var(--pcolor2)]" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
            >
              <ChevronRight className="w-4 h-4 text-[var(--pcolor2)]" />
            </button>
          </>
        )}

        {/* Heart */}
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 z-10 transition-transform duration-200 hover:scale-110 active:scale-90"
        >
          <Heart
            className={`w-6 h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-colors duration-200 ${
              isLiked
                ? "fill-[var(--pcolor1)] text-[var(--pcolor1)]"
                : "fill-[rgba(0,0,0,0.4)] text-white stroke-2"
            }`}
          />
        </button>

        {/* Status */}
        {property?.status && property.status !== "available" && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-white/95 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold text-[var(--pcolor2)] tracking-wider uppercase font-body">
              {property.status === "reserved" ? "Reserved" : "Sold"}
            </span>
          </div>
        )}

        {/* Dots */}
        {renderDots()}
      </div>

      {/* Content */}
      <div className="space-y-[2px]">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-[15px] text-[var(--pcolor2)] leading-snug truncate">
            {property?.property_type || "Property"}
            {property?.project?.name ? ` in ${property.project.name}` : ""}
          </h3>
          {property?.rating && (
            <div className="flex items-center gap-1 shrink-0 pt-[1px]">
              <Star className="w-3.5 h-3.5 fill-[var(--pcolor1)] text-[var(--pcolor1)]" />
              <span className="text-[13px] text-[var(--pcolor2)] font-body">
                {property.rating}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-[#6b7280]">
          <MapPin className="w-3 h-3 shrink-0" />
          <p className="text-[13px] truncate font-body">
            {property?.project?.location_name || "Cairo, Egypt"}
          </p>
        </div>

        <p className="text-[#6b7280] text-[13px] font-body">
          {property?.bedrooms || 0} bed{property?.bedrooms !== 1 ? "s" : ""} ·{" "}
          {property?.bathrooms || 0} bath
          {property?.bathrooms !== 1 ? "s" : ""} · {property?.area_sqm || 0} m²
        </p>

        <p className="pt-1">
          <span className="font-bold text-[15px] text-[var(--pcolor1)] font-body">
            EGP {formatPrice(property?.price)}
          </span>
          {property?.installment_price && (
            <span className="text-[#6b7280] text-[13px] font-body">
              {" · "}
              {formatPrice(property.installment_price)}/mo
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
