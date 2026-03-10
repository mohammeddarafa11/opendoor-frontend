export default function PropertiesLoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-[4/3] rounded-xl bg-[#ede8e0] mb-3 overflow-hidden relative">
            <div className="absolute inset-0 img-loading" />
          </div>
          <div className="flex justify-between items-start mb-[6px]">
            <div className="h-[14px] bg-[#ede8e0] rounded-full w-3/5" />
            <div className="h-[14px] bg-[#ede8e0] rounded-full w-10" />
          </div>
          <div className="h-[13px] bg-[#ede8e0] rounded-full w-2/5 mb-[4px]" />
          <div className="h-[13px] bg-[#ede8e0] rounded-full w-1/2 mb-[4px]" />
          <div className="h-[14px] bg-[#ede8e0] rounded-full w-1/3 mt-2" />
        </div>
      ))}
    </div>
  );
}
