export function Skeleton({ className = "", variant = "default" }) {
  const baseStyles = "relative overflow-hidden bg-gray-200 rounded-lg";

  const variants = {
    default: baseStyles,
    card: `${baseStyles} h-[400px]`,
    text: `${baseStyles} h-4`,
    title: `${baseStyles} h-8`,
    circle: `${baseStyles} rounded-full`,
  };

  return (
    <div className={`${variants[variant]} ${className}`}>
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)",
        }}
      />
    </div>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-[20px] w-full overflow-hidden shadow-sm">
      <div className="p-3">
        <Skeleton className="h-[220px] rounded-[18px]" />
      </div>

      <div className="px-4 pb-4 space-y-2">
        <Skeleton variant="title" className="w-3/4 h-5" />
        <Skeleton variant="text" className="w-1/2 h-3" />

        <div className="flex items-center gap-3">
          <Skeleton variant="text" className="w-12 h-3" />
          <Skeleton variant="text" className="w-12 h-3" />
          <Skeleton variant="text" className="w-12 h-3" />
        </div>

        <div className="pt-3 flex justify-between items-center">
          <Skeleton className="w-24 h-8 rounded-full" />
          <Skeleton variant="circle" className="w-9 h-9" />
        </div>
      </div>
    </div>
  );
}
