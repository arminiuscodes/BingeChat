
const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex flex-col gap-8 p-6 animate-pulse bg-gradient-to-b from-base-100/30 to-base-200/20">
      {skeletonMessages.map((_, idx) => {
        const isOwn = idx % 2 === 0;
        return (
          <div
            key={idx}
            className={`flex items-start gap-4 ${isOwn ? "justify-end flex-row-reverse" : "justify-start"}`}
          >
            {/* Enhanced Avatar Skeleton */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-base-300/80 to-base-300/60 shadow-md"></div>
              {/* Online indicator skeleton */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-base-300/70 rounded-full shadow-sm"></div>
            </div>

            {/* Enhanced Message Content Skeleton */}
            <div className={`flex flex-col space-y-3 max-w-xs sm:max-w-md ${isOwn ? "items-end" : "items-start"}`}>
              {/* Timestamp skeleton */}
              <div className="h-3 w-20 bg-base-300/60 rounded-full"></div>
              
              {/* Message bubble skeleton */}
              <div className={`p-4 rounded-2xl space-y-3 shadow-lg backdrop-blur-sm ${
                isOwn 
                  ? "bg-gradient-to-br from-primary/10 to-primary/5 rounded-br-md border border-primary/10" 
                  : "bg-gradient-to-br from-base-300/50 to-base-300/30 rounded-bl-md border border-base-300/30"
              }`}>
                {/* Text content skeleton */}
                <div className="space-y-2">
                  <div className={`h-4 bg-base-300/60 rounded-full ${
                    idx % 3 === 0 ? "w-40" : idx % 3 === 1 ? "w-32" : "w-36"
                  }`}></div>
                  {idx % 4 === 0 && (
                    <div className="h-4 w-24 bg-base-300/60 rounded-full"></div>
                  )}
                </div>
                
                {/* Image skeleton for some messages */}
                {idx % 5 === 0 && (
                  <div className="w-48 h-32 bg-gradient-to-br from-base-300/60 to-base-300/40 rounded-xl shadow-sm"></div>
                )}

                {/* Footer skeleton */}
                <div className="flex items-center justify-between pt-2">
                  <div className="h-3 w-16 bg-base-300/50 rounded-full"></div>
                  {isOwn && <div className="h-3 w-4 bg-base-300/50 rounded"></div>}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Enhanced Typing indicator skeleton */}
      <div className="flex items-start gap-4 justify-start">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-base-300/80 to-base-300/60 shadow-md"></div>
        <div className="flex flex-col space-y-3">
          <div className="h-3 w-20 bg-base-300/60 rounded-full"></div>
          <div className="bg-gradient-to-br from-base-300/50 to-base-300/30 p-4 rounded-2xl rounded-bl-md border border-base-300/30 shadow-lg">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-base-300/60 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-base-300/60 rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-base-300/60 rounded-full animate-pulse delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageSkeleton;
