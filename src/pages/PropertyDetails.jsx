import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUnit } from "../hooks/useUnits";
import { useAuth } from "../context/AuthContext";
import {
  Heart,
  Share,
  ChevronLeft,
  ChevronRight,
  Star,
  Bed,
  Bath,
  Maximize,
  MapPin,
  Shield,
  X,
  Grid2x2,
  ArrowLeft,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { data: property, isLoading, isError } = useUnit(id);

  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showReserveForm, setShowReserveForm] = useState(false);

  const images =
    property?.images?.length > 0 ? property.images : [DEFAULT_IMAGE];
  const isAvailable = property?.status === "available";

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${property?.property_type} in ${property?.project?.name}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied!");
      }
    } catch (err) {
      // User cancelled share
    }
  };

  if (isLoading) return <PropertyDetailsSkeleton />;
  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#222] text-lg font-semibold mb-2">
            Property not found
          </p>
          <p className="text-[#717171] mb-4">
            This property may have been removed
          </p>
          <button
            onClick={() => navigate("/")}
            className="airbnb-btn airbnb-btn-primary px-6 py-3"
          >
            Back to listings
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      {/* ===== Top Bar ===== */}
      <div className="sticky top-0 z-50 bg-white border-b border-[#ebebeb]">
        <div className="max-w-[1120px] mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#222] hover:text-[#000] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">Back</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#f7f7f7] transition-colors text-sm font-semibold text-[#222] underline"
            >
              <Share className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#f7f7f7] transition-colors text-sm font-semibold text-[#222] underline"
            >
              <Heart
                className={`w-4 h-4 ${
                  isLiked ? "fill-[var(--pcolor1)] text-[var(--pcolor1)]" : ""
                }`}
              />
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1120px] mx-auto px-6">
        {/* ===== Title Section ===== */}
        <div className="pt-6 pb-4">
          <h1 className="text-[26px] font-semibold text-[#222] leading-tight">
            {property?.property_type || "Property"} in{" "}
            {property?.project?.name || "Project"}
          </h1>
          <div className="flex items-center gap-2 mt-1 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-[#222] text-[#222]" />
              <span className="font-semibold">{property?.rating || "New"}</span>
            </div>
            <span className="text-[#717171]">·</span>
            <span className="font-semibold text-[#222] underline cursor-pointer">
              {property?.project?.location_name || "Cairo, Egypt"}
            </span>
          </div>
        </div>

        {/* ===== Photo Grid - Airbnb style ===== */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-xl overflow-hidden aspect-[2/1] md:aspect-[2.5/1]">
            {/* Main Image */}
            <div
              className="md:col-span-2 md:row-span-2 relative cursor-pointer group"
              onClick={() => {
                setCurrentPhoto(0);
                setShowAllPhotos(true);
              }}
            >
              <img
                src={images[0]}
                alt="Main"
                className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-200"
              />
            </div>

            {/* Side Images */}
            {images.slice(1, 5).map((img, index) => (
              <div
                key={index}
                className="hidden md:block relative cursor-pointer group"
                onClick={() => {
                  setCurrentPhoto(index + 1);
                  setShowAllPhotos(true);
                }}
              >
                <img
                  src={img}
                  alt={`View ${index + 2}`}
                  className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-200"
                  onError={(e) => {
                    e.target.src = DEFAULT_IMAGE;
                  }}
                />
              </div>
            ))}
          </div>

          {/* Show All Photos Button */}
          <button
            onClick={() => setShowAllPhotos(true)}
            className="absolute bottom-4 right-4 px-4 py-2 bg-white text-[#222] text-sm font-semibold rounded-lg border border-[#222] hover:bg-[#f7f7f7] transition-colors flex items-center gap-2 shadow-md"
          >
            <Grid2x2 className="w-4 h-4" />
            Show all photos
          </button>
        </div>

        {/* ===== Main Content Grid ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 py-8">
          {/* Left Content */}
          <div>
            {/* Property Type & Features */}
            <div className="pb-8 border-b border-[#ebebeb]">
              <h2 className="text-[22px] font-semibold text-[#222]">
                {property?.property_type || "Property"} hosted by{" "}
                {property?.agent?.name || "Developer"}
              </h2>
              <div className="flex items-center gap-2 mt-2 text-[#222] text-base">
                <span>{property?.bedrooms || 0} bedrooms</span>
                <span>·</span>
                <span>{property?.bathrooms || 0} bathrooms</span>
                <span>·</span>
                <span>{property?.area_sqm || 0} m²</span>
              </div>
            </div>

            {/* Key Features - Airbnb style */}
            <div className="py-8 border-b border-[#ebebeb] space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-[#222] mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-[#222]">Great location</p>
                  <p className="text-[#717171] text-sm">
                    {property?.project?.location_name || "Prime location"} —
                    easy access to major landmarks
                  </p>
                </div>
              </div>

              {property?.has_garden && (
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-[#222] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-[#222]">Private garden</p>
                    <p className="text-[#717171] text-sm">
                      This property includes a private garden area
                    </p>
                  </div>
                </div>
              )}

              {property?.view_type && (
                <div className="flex items-start gap-4">
                  <Star className="w-6 h-6 text-[#222] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-[#222]">
                      {property.view_type} view
                    </p>
                    <p className="text-[#717171] text-sm">
                      Enjoy a beautiful {property.view_type.toLowerCase()} view
                      from your property
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="py-8 border-b border-[#ebebeb]">
              <h3 className="text-[22px] font-semibold text-[#222] mb-4">
                About this property
              </h3>
              <p className="text-[#222] leading-relaxed whitespace-pre-line">
                {property?.description ||
                  `Beautiful ${property?.property_type?.toLowerCase() || "property"} located in ${property?.project?.name || "a premium project"}. Features ${property?.bedrooms || 0} spacious bedrooms and ${property?.bathrooms || 0} modern bathrooms with a total area of ${property?.area_sqm || 0} m².`}
              </p>
            </div>

            {/* Amenities */}
            {property?.amenities?.length > 0 && (
              <div className="py-8 border-b border-[#ebebeb]">
                <h3 className="text-[22px] font-semibold text-[#222] mb-6">
                  What this place offers
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-4 py-1">
                      <Check className="w-5 h-5 text-[#222] shrink-0" />
                      <span className="text-[#222]">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Property Details Grid */}
            <div className="py-8 border-b border-[#ebebeb]">
              <h3 className="text-[22px] font-semibold text-[#222] mb-6">
                Property details
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {[
                  {
                    icon: Bed,
                    label: "Bedrooms",
                    value: property?.bedrooms || 0,
                  },
                  {
                    icon: Bath,
                    label: "Bathrooms",
                    value: property?.bathrooms || 0,
                  },
                  {
                    icon: Maximize,
                    label: "Area",
                    value: `${property?.area_sqm || 0} m²`,
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="p-4 rounded-xl border border-[#ebebeb] text-center"
                  >
                    <Icon className="w-6 h-6 text-[#717171] mx-auto mb-2" />
                    <p className="text-sm text-[#717171]">{label}</p>
                    <p className="text-lg font-semibold text-[#222]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== Right Sidebar - Reservation Card ===== */}
          <div className="lg:block">
            <div className="sticky top-24">
              <div className="border border-[#dddddd] rounded-xl p-6 shadow-[0_6px_16px_rgba(0,0,0,0.12)]">
                {/* Price */}
                <div className="mb-6">
                  <span className="text-[22px] font-semibold text-[#222]">
                    EGP {(property?.price || 0).toLocaleString()}
                  </span>
                  {property?.installment_price && (
                    <p className="text-[#717171] text-sm mt-1">
                      or EGP {property.installment_price.toLocaleString()}/month
                    </p>
                  )}
                </div>

                {/* Status */}
                <div
                  className={`p-3 rounded-lg mb-4 text-center text-sm font-medium ${
                    isAvailable
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : property?.status === "reserved"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {isAvailable
                    ? "✓ Available for reservation"
                    : property?.status === "reserved"
                      ? "⏳ Currently reserved"
                      : "✕ Sold"}
                </div>

                {/* Reserve Form */}
                {showReserveForm ? (
                  <ReserveForm
                    user={user}
                    unit={property}
                    onClose={() => setShowReserveForm(false)}
                  />
                ) : (
                  <>
                    {/* CTA Button */}
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          toast.error("Please login to reserve");
                          navigate("/login");
                          return;
                        }
                        setShowReserveForm(true);
                      }}
                      className="w-full py-3.5 rounded-lg font-semibold text-base text-white transition-all duration-200 airbnb-btn-primary"
                    >
                      {isAvailable ? "Reserve" : "Join waiting list"}
                    </button>

                    <p className="text-center text-[#717171] text-xs mt-3">
                      You won't be charged yet
                    </p>
                  </>
                )}

                {/* Price Breakdown */}
                <div className="mt-6 pt-6 border-t border-[#ebebeb] space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#222] underline cursor-pointer">
                      Property price
                    </span>
                    <span className="text-[#222]">
                      EGP {(property?.price || 0).toLocaleString()}
                    </span>
                  </div>
                  {property?.down_payment && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#222] underline cursor-pointer">
                        Down payment
                      </span>
                      <span className="text-[#222]">
                        EGP {property.down_payment.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-[#ebebeb]">
                    <span className="font-semibold text-[#222]">Total</span>
                    <span className="font-semibold text-[#222]">
                      EGP {(property?.price || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Report */}
              <div className="text-center mt-4">
                <button className="text-[#717171] text-xs underline hover:text-[#222] transition-colors">
                  Report this listing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== All Photos Modal ===== */}
      {showAllPhotos && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 p-4 flex items-center border-b border-[#ebebeb]">
            <button
              onClick={() => setShowAllPhotos(false)}
              className="p-2 rounded-full hover:bg-[#f7f7f7] transition-colors"
            >
              <X className="w-5 h-5 text-[#222]" />
            </button>
            <span className="ml-4 text-sm font-semibold text-[#222]">
              {currentPhoto + 1} / {images.length}
            </span>
          </div>

          <div className="max-w-[800px] mx-auto px-4 py-8 space-y-2">
            {images.map((img, index) => (
              <div key={index} className="rounded-lg overflow-hidden">
                <img
                  src={img}
                  alt={`Photo ${index + 1}`}
                  className="w-full object-cover"
                  onError={(e) => {
                    e.target.src = DEFAULT_IMAGE;
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== Reserve Form Inline ===== */
function ReserveForm({ user, unit, onClose }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      toast.success("Request submitted successfully!");
      onClose();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        required
        placeholder="Full name"
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, name: e.target.value }))
        }
        className="w-full px-4 py-3 border border-[#b0b0b0] rounded-lg text-sm text-[#222] placeholder-[#717171] focus:outline-none focus:border-[#222] focus:ring-1 focus:ring-[#222] transition-colors"
      />
      <input
        type="email"
        required
        placeholder="Email"
        value={formData.email}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, email: e.target.value }))
        }
        className="w-full px-4 py-3 border border-[#b0b0b0] rounded-lg text-sm text-[#222] placeholder-[#717171] focus:outline-none focus:border-[#222] focus:ring-1 focus:ring-[#222] transition-colors"
      />
      <input
        type="tel"
        required
        placeholder="Phone number"
        value={formData.phone}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, phone: e.target.value }))
        }
        className="w-full px-4 py-3 border border-[#b0b0b0] rounded-lg text-sm text-[#222] placeholder-[#717171] focus:outline-none focus:border-[#222] focus:ring-1 focus:ring-[#222] transition-colors"
      />
      <textarea
        rows={2}
        placeholder="Message (optional)"
        value={formData.message}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, message: e.target.value }))
        }
        className="w-full px-4 py-3 border border-[#b0b0b0] rounded-lg text-sm text-[#222] placeholder-[#717171] focus:outline-none focus:border-[#222] focus:ring-1 focus:ring-[#222] transition-colors resize-none"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-lg font-semibold text-white airbnb-btn-primary disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit request"}
      </button>
      <button
        type="button"
        onClick={onClose}
        className="w-full py-3 text-sm font-semibold text-[#222] underline hover:text-[#000]"
      >
        Cancel
      </button>
    </form>
  );
}

/* ===== Loading Skeleton ===== */
function PropertyDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <div className="max-w-[1120px] mx-auto px-6 pt-20">
        <div className="h-8 bg-[#f0f0f0] rounded-lg w-2/3 mb-2" />
        <div className="h-4 bg-[#f0f0f0] rounded-lg w-1/3 mb-6" />
        <div className="grid grid-cols-4 gap-2 rounded-xl overflow-hidden aspect-[2.5/1]">
          <div className="col-span-2 row-span-2 bg-[#f0f0f0]" />
          <div className="bg-[#f0f0f0]" />
          <div className="bg-[#f0f0f0]" />
          <div className="bg-[#f0f0f0]" />
          <div className="bg-[#f0f0f0]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 py-8">
          <div className="space-y-4">
            <div className="h-6 bg-[#f0f0f0] rounded w-1/2" />
            <div className="h-4 bg-[#f0f0f0] rounded w-1/3" />
            <div className="h-px bg-[#ebebeb] my-8" />
            <div className="space-y-3">
              <div className="h-4 bg-[#f0f0f0] rounded w-full" />
              <div className="h-4 bg-[#f0f0f0] rounded w-4/5" />
              <div className="h-4 bg-[#f0f0f0] rounded w-3/5" />
            </div>
          </div>
          <div>
            <div className="h-[400px] bg-[#f0f0f0] rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
