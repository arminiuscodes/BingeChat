import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import SidebarSkeleton from './skeletons/SidebarSkeleton.jsx';
import FriendRequests from './FriendRequests.jsx';
import { Users, Search, UserPlus, Bell } from 'lucide-react';
import { UseAuthStore } from '../store/UseAuthStore.js';

// No props needed anymore for mobile menu state as HomePage handles rendering
const Sidebar = ({ onProfileClick }) => { // Accept onProfileClick as a prop
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, friendRequests, getFriendRequests } = useChatStore();
  const { onlineUsers } = UseAuthStore();
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false); // New state for online filter

  useEffect(() => {
    getUsers();
    getFriendRequests();
  }, [getUsers, getFriendRequests]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.username?.toLowerCase().includes(searchQuery.toLowerCase());
    const isOnline = onlineUsers.includes(user._id);

    if (showOnlineOnly) {
      return matchesSearch && isOnline;
    }
    return matchesSearch;
  });

  if (isUsersLoading) return <SidebarSkeleton />

  return (
    <>
      <aside className={`
        h-full flex flex-col transition-all duration-300
        bg-gradient-to-b from-base-100/95 to-base-200/95 backdrop-blur-sm
        w-full lg:w-20 xl:w-80 border-r lg:border-base-300/30
      `}>
        {/* Enhanced Header */}
        <div className="border-b border-base-300/30 w-full p-4 bg-gradient-to-r from-base-100/60 to-base-100/40 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="size-5 text-primary" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center shadow-md">
                  <span className="text-xs font-bold text-white">{users.length}</span>
                </div>
              </div>
              {/* Only show 'Friends' text on larger screens / when sidebar is fully visible */}
              <div className="block lg:hidden xl:block min-w-0">
                <h2 className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent truncate">
                  Friends
                </h2>
                <p className="text-xs text-base-content/60 truncate">
                  {users.filter(user => onlineUsers.includes(user._id)).length} online
                </p>
              </div>
            </div>
            {/* Friend Request Button */}
            <button
              onClick={() => {
                setShowFriendRequests(true);
                // No need to explicitly close sidebar; HomePage handles view switching
              }}
              className="btn btn-primary btn-sm btn-circle shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 relative flex-shrink-0"
              title="Friend Requests"
            >
              <UserPlus size={16} />
              {friendRequests.length > 0 && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-error rounded-full flex items-center justify-center shadow-md animate-pulse">
                  <span className="text-xs font-bold text-white">{friendRequests.length}</span>
                </div>
              )}
            </button>
          </div>

          {/* Search bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-base-200/50 border border-base-300/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Show Online Only Checkbox */}
          <div className="form-control">
            <label className="label cursor-pointer p-0 gap-2 justify-start">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-primary checkbox-xs"
              />
              <span className="label-text text-xs text-base-content/70">Show only online users</span>
            </label>
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-base-200/20">
          {filteredUsers.length === 0 && searchQuery !== '' && (
            <p className="text-center text-base-content/60 py-4">No users found matching "{searchQuery}"</p>
          )}
          {filteredUsers.length === 0 && searchQuery === '' && showOnlineOnly && (
            <p className="text-center text-base-content/60 py-4">No online users found.</p>
          )}
          {filteredUsers.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            const isSelected = selectedUser?._id === user._id;

            return (
              <div
                key={user._id}
                onClick={() => {
                  setSelectedUser(user);
                  // No need to explicitly close sidebar; HomePage handles view switching
                }}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
                  ${isSelected ? "bg-gradient-to-r from-primary/20 to-primary/10 shadow-lg border border-primary/30" : "hover:bg-base-200/50 hover:shadow-md border border-base-300/30"}
                `}
              >
                {/* Avatar with onClick to open profile */}
                <div
                  className="relative shrink-0 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent opening chat when clicking avatar
                    onProfileClick && onProfileClick(user); // Ensure onProfileClick is a function
                  }}
                >
                  <div className="avatar">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-md transition-all
                      ${isOnline ? "ring-2 ring-success/30" : "ring-1 ring-base-300/50"}
                    `}>
                      <img src={user.profilePic || '/avatar.png'} alt="profile" className="object-cover" />
                    </div>
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-base-100
                    ${isOnline ? "bg-success" : "bg-base-400"}
                  `}></div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base-content truncate">
                    {user.fullName}
                  </h3>
                  <p className={`text-xs ${isOnline ? "text-success" : "text-base-content/60"} truncate`}>
                    {isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced bottom section */}
        {friendRequests.length > 0 && (
          <div className="p-4 border-t border-base-300/30 bg-gradient-to-r from-base-100/40 to-base-100/20 flex-shrink-0">
            <button
              onClick={() => { setShowFriendRequests(true); }}
              className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell size={16} className="text-primary" />
                </div>
                <div className="text-left min-w-0 block lg:hidden xl:block">
                  <p className="text-sm font-semibold text-base-content truncate">
                    {friendRequests.length} Friend Request{friendRequests.length > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-base-content/60 truncate">
                    Tap to view and respond
                  </p>
                </div>
              </div>
              <div className="w-6 h-6 bg-error rounded-full flex items-center justify-center shadow-md animate-pulse flex-shrink-0">
                <span className="text-xs font-bold text-white">{friendRequests.length}</span>
              </div>
            </button>
          </div>
        )}
      </aside>

      {/* Friend Requests Modal */}
      <FriendRequests
        isOpen={showFriendRequests}
        onClose={() => setShowFriendRequests(false)}
      />
    </>
  );
};

export default Sidebar;
