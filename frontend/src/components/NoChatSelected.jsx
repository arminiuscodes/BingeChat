import React, { useState } from "react";
import { MessageSquare, Users, Zap, Shield, Heart, UserPlus } from "lucide-react";
import FriendRequests from "./FriendRequests";

const NoChatSelected = () => {
  const [showFriendRequests, setShowFriendRequests] = useState(false);

  return (
    <>
      <div className="w-full flex flex-1 flex-col items-center justify-center p-4 sm:p-6 md:p-16 bg-gradient-to-br from-base-100/50 via-base-200/30 to-base-100/50 relative overflow-hidden">
        {/* Background decorative elements - reduced for mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-16 sm:w-32 h-16 sm:h-32 bg-primary/5 rounded-full blur-xl sm:blur-2xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-20 sm:w-40 h-20 sm:h-40 bg-secondary/5 rounded-full blur-xl sm:blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-12 sm:w-24 h-12 sm:h-24 bg-accent/5 rounded-full blur-xl sm:blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Mobile-optimized content container */}
        <div className="max-w-full sm:max-w-md text-center space-y-4 sm:space-y-8 relative z-10 px-2">
          {/* Animated Icon Display - scaled down for mobile */}
          <div className="flex justify-center gap-2 sm:gap-4 mb-4 sm:mb-8">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center animate-bounce shadow-lg backdrop-blur-sm">
                <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary animate-pulse" />
              </div>
              {/* Floating particles - scaled down */}
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-secondary rounded-full animate-ping"></div>
              <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 sm:w-3 sm:h-3 bg-accent rounded-full animate-ping delay-500"></div>
            </div>
          </div>

          {/* Welcome Content - adjusted spacing for mobile */}
          <div className="space-y-2 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Welcome to BingeChat!
            </h2>
            <p className="text-base-content/70 text-sm sm:text-base md:text-lg leading-relaxed">
              Connect with friends and start meaningful conversations
            </p>
          </div>

          {/* Feature highlights - stacked on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-8">
            <div className="flex flex-col items-center p-2 sm:p-4 bg-base-100/50 rounded-xl sm:rounded-2xl border border-base-300/50 backdrop-blur-sm hover:bg-base-100/70 transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm text-base-content mb-1">Fast & Secure</h3>
              <p className="text-xs text-base-content/60 text-center">
                Lightning-fast messaging with end-to-end encryption
              </p>
            </div>

            <div className="flex flex-col items-center p-2 sm:p-4 bg-base-100/50 rounded-xl sm:rounded-2xl border border-base-300/50 backdrop-blur-sm hover:bg-base-100/70 transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary/10 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm text-base-content mb-1">Friend System</h3>
              <p className="text-xs text-base-content/60 text-center">
                Connect with friends through secure friend requests
              </p>
            </div>

            <div className="flex flex-col items-center p-2 sm:p-4 bg-base-100/50 rounded-xl sm:rounded-2xl border border-base-300/50 backdrop-blur-sm hover:bg-base-100/70 transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm text-base-content mb-1">Easy to Use</h3>
              <p className="text-xs text-base-content/60 text-center">
                Simple and intuitive interface for everyone
              </p>
            </div>
          </div>

          {/* Call to action - adjusted for mobile */}
          <div className="pt-3 sm:pt-6 space-y-2 sm:space-y-4">
            <button
              onClick={() => setShowFriendRequests(true)}
              className="btn btn-primary shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-secondary border-none text-sm sm:text-base"
            >
              <UserPlus size={18} className="sm:size-5" />
              <span className="ml-1">Find & Add Friends</span>
            </button>
            
            <div className="inline-flex items-center gap-1 sm:gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-full backdrop-blur-sm">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-base-content/80">
                Add friends to start chatting
              </span>
            </div>
          </div>
        </div>

        {/* Floating animation elements - reduced for mobile */}
        <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 opacity-20 animate-bounce delay-700">
          <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        </div>
        <div className="absolute top-16 right-16 sm:top-20 sm:right-20 opacity-20 animate-bounce delay-1000">
          <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
        </div>
        <div className="absolute bottom-16 right-12 sm:bottom-20 sm:right-16 opacity-20 animate-bounce delay-300">
          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
        </div>
      </div>
      
      {/* Friend Requests Modal */}
      <FriendRequests 
        isOpen={showFriendRequests} 
        onClose={() => setShowFriendRequests(false)} 
      />
    </>
  );
};

export default NoChatSelected;