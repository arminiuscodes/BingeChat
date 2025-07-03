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
    const isSent = sentRequests.some(req => req.recipient._id === userId);
    const isReceived = friendRequests.some(req => req.sender._id === userId);
    if (isSent) return 'sent';
    if (isReceived) return 'received';
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3">
      <div className="relative bg-base-100 rounded-xl sm:rounded-3xl shadow-2xl border border-base-300/30 overflow-hidden w-full max-w-xl h-[95vh] sm:h-[90vh] flex flex-col">
        
        {/* Header */}
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

        {/* Tabs */}
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto sm:p-5 p-3 space-y-4">

          {/* Search Users */}
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
                    const status = getRequestStatus(user._id);
                    const isOwnProfile = authUser && user._id === authUser._id;
                    if (isOwnProfile) return null;

                    return (
                      <div key={user._id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 bg-base-200 rounded-lg border">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="avatar">
                            <div className="w-10 h-10 rounded-full">
                              <img src={user.profilePic || "/avatar.png"} alt={user.fullName} />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold">{user.fullName}</h3>
                            <p className="text-sm text-base-content/60">@{user.username}</p>
                          </div>
                        </div>

                        {/* Status Actions */}
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
                                const matched = friendRequests.find(r => r.sender._id === user._id);
                                if (matched) acceptFriendRequest(matched._id);
                              }}
                              disabled={isManagingRequest}
                              className="btn btn-success btn-sm w-full sm:w-auto"
                            >
                              <Check size={16} /> Accept
                            </button>
                            <button
                              onClick={() => {
                                const matched = friendRequests.find(r => r.sender._id === user._id);
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

          {/* Received Requests */}
          {activeTab === 'received' && (
            friendRequests.length > 0 ? (
              friendRequests.map(request => (
                <div key={request._id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 bg-base-200 rounded-lg border">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full">
                        <img src={request.sender.profilePic || "/avatar.png"} alt={request.sender.fullName} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold">{request.sender.fullName}</h3>
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

          {/* Sent Requests */}
          {activeTab === 'sent' && (
            sentRequests.length > 0 ? (
              sentRequests.map(request => (
                <div key={request._id} className="flex items-center gap-4 p-3 bg-base-200 rounded-lg border">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full">
                      <img src={request.recipient.profilePic || "/avatar.png"} alt={request.recipient.fullName} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{request.recipient.fullName}</h3>
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
