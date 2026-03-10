import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Range } from "react-range";
import {
  SlidersHorizontal,
  Building2,
  Banknote,
  BedDouble,
  Bath,
  Waves,
  X,
  RotateCcw,
} from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const filterCategories = [
  { id: "all", label: "Filters", icon: SlidersHorizontal },
  { id: "property", label: "Type", icon: Building2 },
  { id: "price", label: "Price", icon: Banknote },
  { id: "beds", label: "Beds & Baths", icon: BedDouble },
  { id: "amenities", label: "Amenities", icon: Waves },
];

function FilterBar({ filters, onFilterChange, totalCount = 0 }) {
  const [selectedBeds, setSelectedBeds] = useState(filters?.bedrooms || []);
  const [selectedBaths, setSelectedBaths] = useState(filters?.bathrooms || []);
  const [priceRange, setPriceRange] = useState([
    filters?.minPrice || 0,
    filters?.maxPrice || 50000000,
  ]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState(
    filters?.propertyTypes || [],
  );
  const [selectedAmenities, setSelectedAmenities] = useState(
    filters?.amenities || [],
  );
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Stable reference to avoid infinite loops
  const stableOnFilterChange = useCallback(onFilterChange, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      stableOnFilterChange({
        bedrooms: selectedBeds,
        bathrooms: selectedBaths,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        propertyTypes: selectedPropertyTypes,
        amenities: selectedAmenities,
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [
    selectedBeds,
    selectedBaths,
    priceRange,
    selectedPropertyTypes,
    selectedAmenities,
    stableOnFilterChange,
  ]);

  const applyFilters = () => {
    onFilterChange({
      bedrooms: selectedBeds,
      bathrooms: selectedBaths,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      propertyTypes: selectedPropertyTypes,
      amenities: selectedAmenities,
    });
  };

  const clearFilters = () => {
    setSelectedBeds([]);
    setSelectedBaths([]);
    setPriceRange([0, 50000000]);
    setSelectedPropertyTypes([]);
    setSelectedAmenities([]);
  };

  const activeFiltersCount =
    selectedBeds.length +
    selectedBaths.length +
    selectedPropertyTypes.length +
    selectedAmenities.length +
    (priceRange[0] > 0 || priceRange[1] < 50000000 ? 1 : 0);

  // Check if specific filter category has active filters
  const getCategoryCount = (id) => {
    switch (id) {
      case "property":
        return selectedPropertyTypes.length;
      case "price":
        return priceRange[0] > 0 || priceRange[1] < 50000000 ? 1 : 0;
      case "beds":
        return selectedBeds.length + selectedBaths.length;
      case "amenities":
        return selectedAmenities.length;
      case "all":
        return activeFiltersCount;
      default:
        return 0;
    }
  };

  return (
    <div className="bg-white">
      <div className="relative">
        <div className="overflow-x-auto overflow-y-hidden no-scrollbar">
          <div className="flex items-center gap-2 px-6 py-3 pr-16 md:pr-6">
            {filterCategories.map((filter) => {
              const IconComponent = filter.icon;
              const count = getCategoryCount(filter.id);
              const isActive = count > 0;

              return (
                <Drawer
                  key={filter.id}
                  direction={isDesktop ? "right" : "bottom"}
                >
                  <DrawerTrigger asChild>
                    <button
                      className={`shrink-0 h-[48px] px-4 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 border ${
                        isActive
                          ? "bg-[#222] text-white border-[#222] hover:bg-[#000]"
                          : "bg-white text-[#222] border-[#b0b0b0] hover:border-[#222] hover:bg-[#f7f7f7]"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {filter.label}
                      {count > 0 && (
                        <span
                          className={`ml-0.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                            isActive
                              ? "bg-white text-[#222]"
                              : "bg-[var(--pcolor1)] text-white"
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  </DrawerTrigger>

                  <DrawerContent
                    className={`bg-white ${
                      isDesktop
                        ? "h-full w-[480px] max-w-[90vw]"
                        : "max-h-[90vh] rounded-t-[10px]"
                    }`}
                  >
                    {/* Header */}
                    <DrawerHeader className="border-b border-[#ebebeb] px-6">
                      <div className="flex items-center justify-between">
                        <DrawerClose asChild>
                          <button className="w-8 h-8 rounded-full hover:bg-[#f7f7f7] flex items-center justify-center transition-colors">
                            <X className="w-4 h-4 text-[#222]" />
                          </button>
                        </DrawerClose>
                        <DrawerTitle className="text-base font-bold text-[#222]">
                          {filter.label}
                        </DrawerTitle>
                        <div className="w-8" /> {/* Spacer */}
                      </div>
                    </DrawerHeader>

                    {/* Content */}
                    <div className="overflow-y-auto flex-1 px-6 py-6">
                      <FilterContent
                        filterId={filter.id}
                        selectedBeds={selectedBeds}
                        setSelectedBeds={setSelectedBeds}
                        selectedBaths={selectedBaths}
                        setSelectedBaths={setSelectedBaths}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        selectedPropertyTypes={selectedPropertyTypes}
                        setSelectedPropertyTypes={setSelectedPropertyTypes}
                        selectedAmenities={selectedAmenities}
                        setSelectedAmenities={setSelectedAmenities}
                      />
                    </div>

                    {/* Footer */}
                    <DrawerFooter className="border-t border-[#ebebeb] px-6 py-4">
                      <div className="flex items-center justify-between w-full">
                        <button
                          onClick={clearFilters}
                          className="text-[#222] text-base font-semibold underline hover:text-[#000] transition-colors flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Clear all
                        </button>
                        <DrawerClose asChild>
                          <Button
                            onClick={applyFilters}
                            className="airbnb-btn-primary px-6 py-3 h-12 rounded-lg text-base font-semibold"
                          >
                            Show {totalCount.toLocaleString()} results
                          </Button>
                        </DrawerClose>
                      </div>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              );
            })}
          </div>
        </div>

        {/* Fade edge on mobile */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden" />
      </div>
    </div>
  );
}

// ===== Filter Content =====
function FilterContent({
  filterId,
  selectedBeds,
  setSelectedBeds,
  selectedBaths,
  setSelectedBaths,
  priceRange,
  setPriceRange,
  selectedPropertyTypes,
  setSelectedPropertyTypes,
  selectedAmenities,
  setSelectedAmenities,
}) {
  const bedroomOptions = ["Studio", "1", "2", "3", "4", "5", "6", "7+"];
  const bathroomOptions = ["1", "2", "3", "4", "5", "6", "7+"];

  const propertyTypes = [
    "Apartment",
    "Villa",
    "Townhouse",
    "Penthouse",
    "Compound",
    "Chalet",
    "Twin House",
    "Duplex",
    "Full Floor",
    "Half Floor",
    "Whole Building",
    "Land",
    "Bungalow",
    "Hotel Apartment",
    "iVilla",
  ];

  const amenities = [
    "Pool",
    "Gym",
    "Parking",
    "Balcony",
    "Garden",
    "Security",
    "Elevator",
    "Pet Friendly",
    "Central AC",
    "Maid Room",
    "Study Room",
    "Storage Room",
  ];

  const MAX_PRICE = 50000000;

  const formatNumber = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const minInput = priceRange[0] === 0 ? "" : formatNumber(priceRange[0]);
  const maxInput =
    priceRange[1] === MAX_PRICE ? "" : formatNumber(priceRange[1]);

  const handleMinChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const numValue = value ? parseInt(value) : 0;
    if (numValue <= priceRange[1]) {
      setPriceRange([numValue, priceRange[1]]);
    }
  };

  const handleMaxChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const numValue = value ? parseInt(value) : MAX_PRICE;
    if (numValue >= priceRange[0]) {
      setPriceRange([priceRange[0], Math.min(numValue, MAX_PRICE)]);
    }
  };

  const toggleBedroom = (bed) =>
    setSelectedBeds((prev) =>
      prev.includes(bed) ? prev.filter((b) => b !== bed) : [...prev, bed],
    );

  const toggleBathroom = (bath) =>
    setSelectedBaths((prev) =>
      prev.includes(bath) ? prev.filter((b) => b !== bath) : [...prev, bath],
    );

  const togglePropertyType = (type) =>
    setSelectedPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );

  const toggleAmenity = (amenity) =>
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );

  // Pill button component
  const Pill = ({ label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-5 py-3 rounded-full text-sm transition-all duration-200 ${
        isActive
          ? "bg-[#222] text-white font-semibold"
          : "bg-white border border-[#b0b0b0] text-[#222] font-medium hover:border-[#222]"
      }`}
    >
      {label}
    </button>
  );

  // Checkbox row component
  const CheckRow = ({ label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full py-4 border-b border-[#ebebeb] last:border-0 group"
    >
      <span className="text-[16px] text-[#222]">{label}</span>
      <div
        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
          isActive
            ? "bg-[#222] border-[#222]"
            : "border-[#b0b0b0] group-hover:border-[#222]"
        }`}
      >
        {isActive && (
          <svg
            className="w-3.5 h-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
    </button>
  );

  // Price slider component
  const PriceSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-[22px] font-semibold text-[#222] mb-1">
          Price range
        </h3>
        <p className="text-[#717171] text-sm">
          Prices in Egyptian Pounds (EGP)
        </p>
      </div>

      {/* Histogram */}
      <Histogram priceRange={priceRange} maxPrice={MAX_PRICE} />

      {/* Range Slider */}
      <div className="px-2 pb-4">
        <Range
          step={100000}
          min={0}
          max={MAX_PRICE}
          values={priceRange}
          onChange={(values) => setPriceRange(values)}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "2px",
                width: "100%",
                backgroundColor: "#dddddd",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  height: "2px",
                  backgroundColor: "#222222",
                  left: `${(priceRange[0] / MAX_PRICE) * 100}%`,
                  right: `${100 - (priceRange[1] / MAX_PRICE) * 100}%`,
                }}
              />
              {children}
            </div>
          )}
          renderThumb={({ props, index }) => (
            <div
              {...props}
              key={index}
              style={{
                ...props.style,
                height: "32px",
                width: "32px",
                borderRadius: "50%",
                backgroundColor: "#fff",
                border: "2px solid #222",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                outline: "none",
              }}
            >
              <div
                style={{
                  width: "4px",
                  height: "12px",
                  display: "flex",
                  gap: "2px",
                }}
              >
                <div
                  style={{
                    width: "1px",
                    height: "100%",
                    backgroundColor: "#717171",
                  }}
                />
                <div
                  style={{
                    width: "1px",
                    height: "100%",
                    backgroundColor: "#717171",
                  }}
                />
              </div>
            </div>
          )}
        />
      </div>

      {/* Input Fields */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="border border-[#b0b0b0] rounded-xl px-4 py-3 focus-within:border-[#222] transition-colors">
            <label className="block text-[10px] font-semibold text-[#717171] uppercase tracking-wide">
              Minimum
            </label>
            <div className="flex items-center gap-1">
              <span className="text-[#222] text-sm">EGP</span>
              <input
                type="text"
                value={minInput}
                onChange={handleMinChange}
                placeholder="0"
                className="w-full text-sm text-[#222] placeholder-[#b0b0b0] bg-transparent outline-none"
              />
            </div>
          </div>
        </div>
        <div className="text-[#dddddd] text-lg">–</div>
        <div className="flex-1">
          <div className="border border-[#b0b0b0] rounded-xl px-4 py-3 focus-within:border-[#222] transition-colors">
            <label className="block text-[10px] font-semibold text-[#717171] uppercase tracking-wide">
              Maximum
            </label>
            <div className="flex items-center gap-1">
              <span className="text-[#222] text-sm">EGP</span>
              <input
                type="text"
                value={maxInput}
                onChange={handleMaxChange}
                placeholder="50,000,000+"
                className="w-full text-sm text-[#222] placeholder-[#b0b0b0] bg-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ===== ALL FILTERS =====
  if (filterId === "all") {
    return (
      <div className="space-y-8">
        {/* Property Type */}
        <div className="pb-8 border-b border-[#ebebeb]">
          <h3 className="text-[22px] font-semibold text-[#222] mb-1">
            Property type
          </h3>
          <p className="text-[#717171] text-sm mb-4">Select one or more</p>
          <div className="flex flex-wrap gap-2">
            {propertyTypes.map((type) => (
              <Pill
                key={type}
                label={type}
                isActive={selectedPropertyTypes.includes(type)}
                onClick={() => togglePropertyType(type)}
              />
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="pb-8 border-b border-[#ebebeb]">
          <PriceSection />
        </div>

        {/* Bedrooms */}
        <div className="pb-8 border-b border-[#ebebeb]">
          <h3 className="text-[22px] font-semibold text-[#222] mb-4">
            Bedrooms
          </h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {bedroomOptions.map((option) => (
              <Pill
                key={option}
                label={option}
                isActive={selectedBeds.includes(option)}
                onClick={() => toggleBedroom(option)}
              />
            ))}
          </div>

          <h3 className="text-[22px] font-semibold text-[#222] mb-4">
            Bathrooms
          </h3>
          <div className="flex flex-wrap gap-2">
            {bathroomOptions.map((option) => (
              <Pill
                key={option}
                label={option}
                isActive={selectedBaths.includes(option)}
                onClick={() => toggleBathroom(option)}
              />
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h3 className="text-[22px] font-semibold text-[#222] mb-4">
            Amenities
          </h3>
          <div>
            {amenities.map((amenity) => (
              <CheckRow
                key={amenity}
                label={amenity}
                isActive={selectedAmenities.includes(amenity)}
                onClick={() => toggleAmenity(amenity)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ===== PROPERTY TYPE =====
  if (filterId === "property") {
    return (
      <div>
        <h3 className="text-[22px] font-semibold text-[#222] mb-1">
          Property type
        </h3>
        <p className="text-[#717171] text-sm mb-6">Select one or more</p>
        <div className="flex flex-wrap gap-2">
          {propertyTypes.map((type) => (
            <Pill
              key={type}
              label={type}
              isActive={selectedPropertyTypes.includes(type)}
              onClick={() => togglePropertyType(type)}
            />
          ))}
        </div>
      </div>
    );
  }

  // ===== PRICE =====
  if (filterId === "price") {
    return <PriceSection />;
  }

  // ===== BEDS & BATHS =====
  if (filterId === "beds") {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-[22px] font-semibold text-[#222] mb-4">
            Bedrooms
          </h3>
          <div className="flex flex-wrap gap-2">
            {bedroomOptions.map((option) => (
              <Pill
                key={option}
                label={option}
                isActive={selectedBeds.includes(option)}
                onClick={() => toggleBedroom(option)}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[22px] font-semibold text-[#222] mb-4">
            Bathrooms
          </h3>
          <div className="flex flex-wrap gap-2">
            {bathroomOptions.map((option) => (
              <Pill
                key={option}
                label={option}
                isActive={selectedBaths.includes(option)}
                onClick={() => toggleBathroom(option)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ===== AMENITIES =====
  if (filterId === "amenities") {
    return (
      <div>
        <h3 className="text-[22px] font-semibold text-[#222] mb-4">
          Amenities
        </h3>
        <div>
          {amenities.map((amenity) => (
            <CheckRow
              key={amenity}
              label={amenity}
              isActive={selectedAmenities.includes(amenity)}
              onClick={() => toggleAmenity(amenity)}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// ===== Histogram =====
function Histogram({ priceRange, maxPrice }) {
  const bars = [
    15, 28, 45, 58, 72, 65, 48, 38, 42, 35, 30, 28, 25, 22, 20, 18, 15, 12, 10,
    8, 7, 6, 5, 4, 3, 2.5, 2, 1.5, 1.2, 1,
  ];
  const maxHeight = Math.max(...bars);

  return (
    <div className="flex items-end gap-[1px] h-16 mb-2">
      {bars.map((height, index) => {
        const barPosition = index / bars.length;
        const minPos = priceRange[0] / maxPrice;
        const maxPos = priceRange[1] / maxPrice;
        const isInRange = barPosition >= minPos && barPosition <= maxPos;

        return (
          <div
            key={index}
            className={`flex-1 rounded-t-[1px] transition-colors duration-200 ${
              isInRange ? "bg-[#222222]" : "bg-[#dddddd]"
            }`}
            style={{
              height: `${(height / maxHeight) * 100}%`,
              minWidth: "2px",
            }}
          />
        );
      })}
    </div>
  );
}

export default FilterBar;
