import React, { useState, useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import {
  Search, UserPlus, Check, X, Clock, Users, UserX
} from 'lucide-react';

const FriendRequests = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('received');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    friendRequests,
    sentRequests,
    searchResults,
    isSearching,
    isSendingRequest,
    isManagingRequest,
    getFriendRequests,
    searchUsers,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    cancelFriendRequest,
    clearSearchResults,
    authUser
  } = useChatStore();

  useEffect(() => {
    if (isOpen) {
      getFriendRequests();
    }
  }, [isOpen, getFriendRequests]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (activeTab === 'search' && searchQuery.trim().length > 0) {
        searchUsers(searchQuery.trim());
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeTab, searchUsers]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const getRequestStatus = (userId) => {
    if (!userId) return null;
    // Ensure string comparison to handle ObjectId vs string in production
    const isSent = sentRequests.some(req => req.receiver?._id?.toString() === userId.toString());
    const isReceived = friendRequests.some(req => req.sender?._id?.toString() === userId.toString());
    if (isSent) return 'sent';
    if (isReceived) return 'received';
    return null;
  };

  if (!isOpen) return null;

  // Debug log to check state in production
  console.log('FriendRequests state:', { friendRequests, sentRequests, searchResults });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3">
      <div className="relative bg-base-100 rounded-xl sm:rounded-3xl shadow-2xl border border-base-300/30 overflow-hidden w-full max-w-xl h-[95vh] sm:h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-base-300/30">
          <h2 className="text-xl font-bold text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
            Friend Requests
          </h2>
          <button
            onClick={() => {
              onClose();
              clearSearchResults();
              setSearchQuery('');
              setActiveTab('received');
            }}
            className="btn btn-ghost btn-circle btn-sm"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex justify-around border-b border-base-300/30 text-sm font-medium">
          {['received', 'sent', 'search'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 transition-colors ${
                activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-base-content/60 hover:text-base-content'
              }`}
            >
              {tab === 'received' && `Received (${friendRequests.length})`}
              {tab === 'sent' && `Sent (${sentRequests.length})`}
              {tab === 'search' && `Search Users`}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto sm:p-5 p-3 space-y-4">
          {activeTab === 'search' && (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                <input
                  type="text"
                  placeholder="Search by username or name..."
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-base-200 border text-sm"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              {isSearching && (
                <div className="text-center py-6">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
              )}
              {!isSearching && searchQuery.length > 0 && searchResults.length === 0 && (
                <div className="text-center py-10 text-base-content/60">
                  <UserX className="w-10 h-10 mx-auto mb-4" />
                  <p>No users found matching "{searchQuery}"</p>
                </div>
              )}
              {!isSearching && searchResults.length > 0 && (
                <div className="space-y-3">
                  {searchResults.map((user) => {
                    if (!user?._id) return null;
                    const status = getRequestStatus(user._id);
                    const isOwnProfile = authUser && user._id.toString() === authUser._id.toString();
                    if (isOwnProfile) return null;
                    return (
                      <div key={user._id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 bg-base-200 rounded-lg border">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="avatar">
                            <div className="w-10 h-10 rounded-full">
                              <img src={user.profilePic || "/avatar.png"} alt={user.fullName || 'User'} />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold">{user.fullName || 'Unknown User'}</h3>
                            <p className="text-sm text-base-content/60">@{user.username || 'unknown'}</p>
                          </div>
                        </div>
                        {!status && (
                          <button
                            onClick={() => sendFriendRequest(user._id)}
                            disabled={isSendingRequest}
                            className="btn btn-primary btn-sm w-full sm:w-auto"
                          >
                            {isSendingRequest ? (
                              <span className="loading loading-spinner loading-sm" />
                            ) : (
                              <>
                                <UserPlus size={16} /> Add
                              </>
                            )}
                          </button>
                        )}
                        {status === 'sent' && (
                          <button disabled className="btn btn-ghost btn-sm text-warning w-full sm:w-auto">
                            <Clock size={16} /> Sent
                          </button>
                        )}
                        {status === 'received' && (
                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => {
                                const matched = friendRequests.find(r => r.sender?._id?.toString() === user._id.toString());
                                if (matched) acceptFriendRequest(matched._id);
                              }}
                              disabled={isManagingRequest}
                              className="btn btn-success btn-sm w-full sm:w-auto"
                            >
                              <Check size={16} /> Accept
                            </button>
                            <button
                              onClick={() => {
                                const matched = friendRequests.find(r => r.sender?._id?.toString() === user._id.toString());
                                if (matched) declineFriendRequest(matched._id);
                              }}
                              disabled={isManagingRequest}
                              className="btn btn-error btn-sm w-full sm:w-auto"
                            >
                              <X size={16} /> Decline
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
          {activeTab === 'received' && (
            friendRequests.length > 0 && friendRequests.every(req => req.sender) ? (
              friendRequests.map(request => (
                <div key={request._id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 bg-base-200 rounded-lg border">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full">
                        <img src={request.sender?.profilePic || "/avatar.png"} alt={request.sender?.fullName || 'Unknown User'} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold">{request.sender?.fullName || 'Unknown User'}</h3>
                      <p className="text-sm text-base-content/60">Wants to be friends</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => acceptFriendRequest(request._id)}
                      disabled={isManagingRequest}
                      className="btn btn-success btn-sm w-full sm:w-auto"
                    >
                      <Check size={16} /> Accept
                    </button>
                    <button
                      onClick={() => declineFriendRequest(request._id)}
                      disabled={isManagingRequest}
                      className="btn btn-error btn-sm w-full sm:w-auto"
                    >
                      <X size={16} /> Decline
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-base-content/60">
                <Users className="w-10 h-10 mx-auto mb-4" />
                <p>No new friend requests</p>
              </div>
            )
          )}
          {activeTab === 'sent' && (
            sentRequests.length > 0 && sentRequests.every(req => req.receiver) ? (
              sentRequests.map(request => (
                request.receiver ? (
                  <div key={request._id} className="flex items-center gap-4 p-3 bg-base-200 rounded-lg border">
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full">
                        <img src={request.receiver?.profilePic || "/avatar.png"} alt={request.receiver?.fullName || 'Unknown User'} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{request.receiver?.fullName || 'Unknown User'}</h3>
                      <p className="text-sm text-warning font-medium">Request pending...</p>
                    </div>
                    <button
                      onClick={() => cancelFriendRequest(request._id)}
                      disabled={isManagingRequest}
                      className="btn btn-ghost btn-sm text-error"
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                ) : null
              ))
            ) : (
              <div className="text-center py-10 text-base-content/60">
                <UserPlus className="w-10 h-10 mx-auto mb-4" />
                <p>No sent friend requests</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendRequests;