
import { Users, Search } from "lucide-react";

const SidebarSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="h-full w-20 lg:w-80 border-r border-base-300/30 flex flex-col transition-all duration-300 bg-gradient-to-b from-base-100/50 to-base-200/30 backdrop-blur-sm animate-pulse">
      {/* Enhanced Header Skeleton */}
      <div className="border-b border-base-300/30 p-4 bg-gradient-to-r from-base-100/60 to-base-100/40 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-base-300/60 to-base-300/40 rounded-xl shadow-md flex items-center justify-center">
              <Users className="w-5 h-5 text-base-300" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-base-300/60 rounded-full"></div>
          </div>
          <div className="hidden lg:block space-y-2 flex-1">
            <div className="h-5 w-24 bg-base-300/60 rounded-full"></div>
            <div className="h-3 w-20 bg-base-300/50 rounded-full"></div>
          </div>
        </div>

        {/* Search Input Skeleton - Desktop */}
        <div className="hidden lg:block relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-300/60" />
          <div className="h-10 w-full bg-base-300/40 rounded-xl"></div>
        </div>
      </div>

      {/* Enhanced Skeleton Contacts */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full p-3 mx-2 flex items-center gap-3 rounded-2xl bg-base-200/30 hover:bg-base-200/50 transition-all duration-300">
            {/* Enhanced Avatar skeleton */}
            <div className="relative shrink-0 mx-auto lg:mx-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-base-300/80 to-base-300/60 shadow-md"></div>
              {/* Online indicator skeleton */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-base-300/60 rounded-full shadow-sm"></div>
            </div>

            {/* Enhanced User info skeleton - desktop only */}
            <div className="hidden lg:block text-left min-w-0 flex-1 space-y-3">
              <div className="h-4 w-28 bg-base-300/60 rounded-full"></div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-16 bg-base-300/50 rounded-full"></div>
                <div className="w-1 h-1 bg-base-300/50 rounded-full"></div>
                <div className="h-3 w-12 bg-base-300/50 rounded-full"></div>
              </div>
            </div>

            {/* Mobile indicator skeleton */}
            <div className="lg:hidden absolute -top-1 -right-1">
              <div className="w-3 h-3 bg-base-300/60 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced bottom section skeleton */}
      <div className="border-t border-base-300/30 p-4 bg-gradient-to-r from-base-100/40 to-base-100/20">
        <div className="flex items-center justify-center lg:justify-between">
          <div className="hidden lg:flex items-center gap-2">
            <div className="w-6 h-6 bg-base-300/60 rounded-full"></div>
            <div className="h-4 w-20 bg-base-300/60 rounded-full"></div>
          </div>
          <div className="w-8 h-8 bg-base-300/60 rounded-full lg:hidden"></div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
