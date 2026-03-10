import { Skeleton } from "@heroui/react";

export default function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
      {/* Image Skeleton */}
      <Skeleton className="rounded-none">
        <div className="aspect-[4/3] bg-default-300"></div>
      </Skeleton>

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton className="w-3/4 rounded-lg">
          <div className="h-6 w-3/4 rounded-lg bg-default-200"></div>
        </Skeleton>

        {/* Location */}
        <Skeleton className="w-1/2 rounded-lg">
          <div className="h-4 w-1/2 rounded-lg bg-default-200"></div>
        </Skeleton>

        {/* Amenities */}
        <div className="flex items-center gap-4 py-1">
          <Skeleton className="w-12 rounded-lg">
            <div className="h-4 w-12 rounded-lg bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-12 rounded-lg">
            <div className="h-4 w-12 rounded-lg bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-16 rounded-lg">
            <div className="h-4 w-16 rounded-lg bg-default-200"></div>
          </Skeleton>
        </div>

        {/* Button */}
        <Skeleton className="w-full rounded-lg">
          <div className="h-10 w-full rounded-lg bg-default-300"></div>
        </Skeleton>
      </div>
    </div>
  );
}
