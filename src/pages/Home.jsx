import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import PropertyCard from "../components/ui/PropertyCard";
import ViewToggle from "../components/ViewToggle";
import PropertiesMapView from "../components/Projectmap";
import PropertiesLoadingSkeleton from "../components/ui/PropertiesLoadingSkeleton";
import { useUnits } from "../hooks/useUnits";
import { wishlistAPI, waitlistAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [hoveredPropertyId, setHoveredPropertyId] = useState(null);
  const [mobileView, setMobileView] = useState("list");
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showFilterSkeleton, setShowFilterSkeleton] = useState(false);
  const listRef = useRef(null);

  const [filters, setFilters] = useState({
    propertyTypes: [],
    bedrooms: [],
    bathrooms: [],
    amenities: [],
    minPrice: 0,
    maxPrice: 50000000,
    page: 1,
    limit: 20,
    sort: "newest",
  });

  // ⭐ TRANSFORM FILTERS TO MATCH BACKEND API EXPECTATIONS
  const transformFiltersForAPI = (filters) => {
    const apiFilters = {
      page: filters.page,
      limit: filters.limit,
      sort: filters.sort,
    };

    // Property types: ["Apartment", "Villa"] → "Apartment,Villa"
    if (filters.propertyTypes?.length > 0) {
      apiFilters.property_type = filters.propertyTypes.join(",");
    }

    // Bedrooms: ["Studio", "1", "2"] → "0,1,2"
    if (filters.bedrooms?.length > 0) {
      apiFilters.bedrooms = filters.bedrooms
        .map((bed) => {
          if (bed === "Studio") return "0";
          if (bed === "7+") return "7";
          return bed;
        })
        .join(",");
    }

    // Bathrooms: ["2", "3", "7+"] → "2,3,7"
    if (filters.bathrooms?.length > 0) {
      apiFilters.bathrooms = filters.bathrooms
        .map((bath) => {
          if (bath === "7+") return "7";
          return bath;
        })
        .join(",");
    }

    // Amenities: ["Pool", "Gym"] → "Pool,Gym"
    if (filters.amenities?.length > 0) {
      apiFilters.amenities = filters.amenities.join(",");
    }

    // Price range
    if (filters.minPrice > 0) {
      apiFilters.minPrice = filters.minPrice;
    }
    if (filters.maxPrice < 50000000) {
      apiFilters.maxPrice = filters.maxPrice;
    }

    console.log("🔍 Filter Transformation:", {
      original: filters,
      transformed: apiFilters,
    });

    return apiFilters;
  };

  // Use transformed filters for API call
  const apiFilters = transformFiltersForAPI(filters);
  const { data, isLoading, isFetching, isError, error } = useUnits(apiFilters);

  // Show skeleton when fetching after filter change, hide when data arrives
  useEffect(() => {
    if (!isFetching && showFilterSkeleton) {
      // Small delay so skeleton doesn't flash too fast
      const timer = setTimeout(() => setShowFilterSkeleton(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isFetching, showFilterSkeleton]);

  const handleFilterChange = (newFilters) => {
    console.log("📊 FilterBar sent:", newFilters);
    setShowFilterSkeleton(true);
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));

    // Scroll list to top
    if (listRef.current) {
      listRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePageChange = (newPage) => {
    setShowFilterSkeleton(true);
    setFilters((prev) => ({ ...prev, page: newPage }));
    if (listRef.current) {
      listRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePropertyClick = (property) => {
    navigate(`/property/${property._id}`);
  };

  const handleReserveClick = (property) => {
    if (!isAuthenticated) {
      toast.error("Please login to reserve a unit");
      navigate("/login", { state: { from: { pathname: "/" } } });
      return;
    }
    setSelectedUnit(property);
    setShowReserveModal(true);
  };

  const handleReserveSubmit = async (formData) => {
    try {
      const isAvailable = selectedUnit.status === "available";

      if (isAvailable) {
        await wishlistAPI.addToWishlist({
          user_name: formData.name,
          user_email: formData.email,
          user_phone: formData.phone,
          unit_id: selectedUnit._id,
        });
        toast.success("Added to wishlist! We'll contact you shortly.");
      } else {
        const response = await waitlistAPI.joinWaitlist({
          user_name: formData.name,
          user_email: formData.email,
          user_phone: formData.phone,
          unit_id: selectedUnit._id,
        });
        toast.success(`You're #${response.position} on the waiting list!`);
      }

      setShowReserveModal(false);
      setSelectedUnit(null);
    } catch (error) {
      console.error("Reservation error:", error);
      toast.error(error.response?.data?.message || "Failed to process request");
    }
  };

  // Show skeleton on initial load OR on filter changes
  const shouldShowSkeleton = (isLoading && !data) || showFilterSkeleton;

  return (
    <div className="min-h-screen w-full bg-white flex flex-col overflow-hidden">
      <ViewToggle view={mobileView} onViewChange={setMobileView} />

      <div className="w-full flex flex-col h-screen overflow-hidden">
        <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0 z-10">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            totalCount={data?.pagination?.total || 0}
          />
        </div>

        <div className="flex-1 flex overflow-hidden relative">
          <div
            ref={listRef}
            className={`
              ${mobileView === "list" ? "flex flex-col" : "hidden"} md:flex md:flex-col
              w-full md:w-[60%] overflow-y-auto
            `}
          >
            <div className="container mx-auto px-4 py-6 relative">
              {shouldShowSkeleton ? (
                <PropertiesLoadingSkeleton count={filters.limit || 6} />
              ) : isError ? (
                <div className="h-[60vh] flex flex-col items-center justify-center text-center p-4">
                  <p className="text-red-500 font-medium mb-2">
                    Failed to load properties
                  </p>
                  <p className="text-gray-500 text-sm mb-4">{error?.message}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-[var(--pcolor1)] text-white rounded-lg"
                  >
                    Retry
                  </button>
                </div>
              ) : !data?.units || data.units.length === 0 ? (
                <div className="h-[60vh] flex items-center justify-center text-gray-500">
                  No properties found matching your criteria.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                  {data.units.map((property) => (
                    <div
                      key={property._id}
                      onMouseEnter={() => setHoveredPropertyId(property._id)}
                      onMouseLeave={() => setHoveredPropertyId(null)}
                    >
                      <PropertyCard
                        property={property}
                        onClick={() => handlePropertyClick(property)}
                        onReserve={() => handleReserveClick(property)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {!shouldShowSkeleton && data?.pagination?.pages > 1 && (
                <div className="flex justify-center gap-2 pb-8">
                  <button
                    disabled={filters.page === 1}
                    onClick={() => handlePageChange(filters.page - 1)}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-gray-100 rounded-lg">
                    Page {filters.page} of {data.pagination.pages}
                  </span>
                  <button
                    disabled={filters.page === data.pagination.pages}
                    onClick={() => handlePageChange(filters.page + 1)}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

          <div
            className={`${
              mobileView === "map" ? "flex" : "hidden"
            } md:flex w-full md:w-[40%] bg-gray-100 relative`}
          >
            <PropertiesMapView
              units={data?.units || []}
              hoveredId={hoveredPropertyId}
            />
          </div>
        </div>
      </div>

      {showReserveModal && selectedUnit && (
        <ReserveModal
          unit={selectedUnit}
          user={user}
          onClose={() => {
            setShowReserveModal(false);
            setSelectedUnit(null);
          }}
          onSubmit={handleReserveSubmit}
        />
      )}
    </div>
  );
}

function ReserveModal({ unit, user, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAvailable = unit.status === "available";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div
          className={`p-6 ${
            isAvailable
              ? "bg-gradient-to-r from-[var(--pcolor1)] to-[var(--pcolor3)]"
              : "bg-gradient-to-r from-amber-500 to-amber-600"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h3 className="text-xl font-bold">
                {isAvailable ? "Reserve Now" : "Join Waiting List"}
              </h3>
              <p className="text-white/80 text-sm">{unit.property_type}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--pcolor1)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              readOnly={!!user?.email}
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--pcolor1)] ${
                user?.email ? "bg-gray-100" : ""
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--pcolor1)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              rows={3}
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--pcolor1)]"
            />
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 font-semibold rounded-lg transition-all duration-300 ${
                isAvailable
                  ? "bg-[var(--pcolor1)] text-white hover:bg-[var(--pcolor3)]"
                  : "bg-amber-500 text-white hover:bg-amber-600"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting
                ? "Processing..."
                : isAvailable
                  ? "Reserve Now"
                  : "Join Waiting List"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
