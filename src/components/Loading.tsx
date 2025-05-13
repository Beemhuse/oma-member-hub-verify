import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingPage() {
  return (
    <div>
      <div className="container mx-auto p-4">
        <div className="flex flex-col gap-6">
          {/* Header Loading */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          {/* Tabs Loading */}
          <div className="space-y-6">
            <Skeleton className="h-10 w-full max-w-md" />

            {/* Content Loading */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-1 lg:col-span-2 space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
