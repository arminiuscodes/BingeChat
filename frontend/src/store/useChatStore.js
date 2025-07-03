import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { UseAuthStore } from "./UseAuthStore.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [], // Only friends will be stored here
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isDeletingMessage: false,
  blockedUsers: [], // ✅ Add blocked users to state

  // Friend Request System
  friendRequests: [], // Received requests
  sentRequests: [], // Sent requests
  searchResults: [], // Search results for new friends
  isSearching: false,
  isSendingRequest: false,
  isManagingRequest: false,

  // Get only friends (users who are connected)
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/friends");
      set({ users: res.data });
    } catch (error) {
      console.log("Error fetching friends:", error);
      // Don't show toast for initial load failures
      set({ users: [] });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Search users by username for friend requests
  searchUsers: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }

    set({ isSearching: true });
    try {
      const res = await axiosInstance.get(`/messages/search-users?query=${encodeURIComponent(query)}`);
      const { authUser } = UseAuthStore.getState();
      
      // Filter out current user and existing friends
      const { users } = get();
      const friendIds = users.map(user => user._id);
      
      const filteredResults = res.data.filter(user => 
        user._id !== authUser._id && !friendIds.includes(user._id)
      );
      
      set({ searchResults: filteredResults });
    } catch (error) {
      console.log("Error searching users:", error);
      set({ searchResults: [] });
    } finally {
      set({ isSearching: false });
    }
  },

  // Clear search results
  clearSearchResults: () => {
    set({ searchResults: [] });
  },

  // Get friend requests (received and sent)
  getFriendRequests: async () => {
    try {
      const [receivedRes, sentRes] = await Promise.all([
        axiosInstance.get("/messages/friend-requests/received"),
        axiosInstance.get("/messages/friend-requests/sent")
      ]);
      
      set({ 
        friendRequests: receivedRes.data,
        sentRequests: sentRes.data 
      });
    } catch (error) {
      console.log("Error fetching friend requests:", error);
      // Set empty arrays on error instead of showing toast
      set({ 
        friendRequests: [],
        sentRequests: [] 
      });
    }
  },

  // Send friend request
  sendFriendRequest: async (userId) => {
    set({ isSendingRequest: true });
    try {
      await axiosInstance.post("/messages/friend-requests/send", { receiverId: userId });
      
      // Move user from search results to sent requests
      const { searchResults } = get();
      const user = searchResults.find(u => u._id === userId);
      if (user) {
        set(state => ({
          sentRequests: [...state.sentRequests, user],
          searchResults: state.searchResults.filter(u => u._id !== userId)
        }));
      }
      
      toast.success("Friend request sent!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send friend request");
    } finally {
      set({ isSendingRequest: false });
    }
  },

  // Accept friend request
  acceptFriendRequest: async (requestId) => {
    set({ isManagingRequest: true });
    try {
      const res = await axiosInstance.post("/messages/friend-requests/accept", { requestId });
      
      // Remove from friend requests and add to users
      set(state => ({
        friendRequests: state.friendRequests.filter(req => req._id !== requestId),
        users: [...state.users, res.data.friend]
      }));
      
      toast.success("Friend request accepted!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept friend request");
    } finally {
      set({ isManagingRequest: false });
    }
  },

  // Decline friend request
  declineFriendRequest: async (requestId) => {
    set({ isManagingRequest: true });
    try {
      await axiosInstance.post("/messages/friend-requests/decline", { requestId });
      
      set(state => ({
        friendRequests: state.friendRequests.filter(req => req._id !== requestId)
      }));
      
      toast.success("Friend request declined");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to decline friend request");
    } finally {
      set({ isManagingRequest: false });
    }
  },

  // Cancel sent friend request
  cancelFriendRequest: async (requestId) => {
    set({ isManagingRequest: true });
    try {
      await axiosInstance.post("/messages/friend-requests/cancel", { requestId });
      
      set(state => ({
        sentRequests: state.sentRequests.filter(req => req._id !== requestId)
      }));
      
      toast.success("Friend request cancelled");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel friend request");
    } finally {
      set({ isManagingRequest: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    if (!selectedUser || typeof selectedUser._id !== "string" || selectedUser._id.length !== 24) {
      toast.error("Invalid user selected to send message.");
      console.warn("❌ Invalid selectedUser in sendMessage:", selectedUser);
      return;
    }

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.error("🔥 sendMessage error:", error);
      // ✅ Show specific error message for blocked users
      if (error.response?.status === 403) {
        toast.error("You cannot message this user because one of you has blocked the other.");
      } else {
        toast.error(error.response?.data?.message || "Failed to send message");
      }
    }
  },

  deleteMessage: async (messageId) => {
    set({ isDeletingMessage: true });
    try {
      await axiosInstance.delete(`/messages/${messageId}`);
      set({ messages: get().messages.filter(message => message._id !== messageId) });
      toast.success("Message deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
    } finally {
      set({ isDeletingMessage: false });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = UseAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = UseAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  // ✅ Fix clearChat to be async
  clearChat: async (userId) => {
    try {
      // Make API call to clear chat using axios instance
      const response = await axiosInstance.delete(`/messages/clear/${userId}`);
      
      // Clear messages from local state
      set({ messages: [] });
      
      return response.data;
    } catch (error) {
      console.error('Error clearing chat:', error);
      throw error;
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  // ✅ Enhanced blockUser function
  blockUser: async (userId) => {
    try {
      const res = await axiosInstance.post(`/auth/block-user/${userId}`);
      
      // ✅ Update blocked users list and refresh it
      await get().getBlockedUsers();
      
      // ✅ Clear selected user if blocking them
      set((state) => ({
        selectedUser: state.selectedUser?._id === userId ? null : state.selectedUser,
        messages: state.selectedUser?._id === userId ? [] : state.messages,
      }));
      
      toast.success("User blocked successfully");
      return true;
    } catch (err) {
      console.error("❌ blockUser error:", err);
      toast.error(err.response?.data?.message || "Failed to block user");
      return false;
    }
  },

  // ✅ Enhanced unblockUser function
  unblockUser: async (userId) => {
    try {
      await axiosInstance.post(`/auth/unblock-user/${userId}`);
      
      // ✅ Update blocked users list
      await get().getBlockedUsers();
      
      toast.success("User unblocked successfully");
      return true;
    } catch (err) {
      console.error("❌ unblockUser error:", err);
      toast.error(err.response?.data?.message || "Failed to unblock user");
      return false;
    }
  },

  // ✅ Enhanced removeFriend function
  removeFriend: async (userId) => {
    try {
      const res = await axiosInstance.delete(`/auth/remove-friend/${userId}`);
      
      // ✅ Update state properly
      set((state) => ({
        users: state.users.filter((u) => u._id !== userId),
        selectedUser: state.selectedUser?._id === userId ? null : state.selectedUser,
        messages: state.selectedUser?._id === userId ? [] : state.messages,
      }));
      
      toast.success("Friend removed successfully");
      return res.data;
    } catch (error) {
      console.error("❌ removeFriend error:", error);
      toast.error(error.response?.data?.message || "Failed to remove friend");
      throw error;
    }
  },

  // ✅ Get Blocked Users Function
  getBlockedUsers: async () => {
    try {
      const res = await axiosInstance.get("/auth/blocked-users");
      set({ blockedUsers: res.data.blockedUsers.map((u) => u._id) });
    } catch (err) {
      console.error("❌ getBlockedUsers error:", err);
      // Don't show toast error for this as it's called frequently
      set({ blockedUsers: [] });
    }
  },

  // ✅ Check if user is blocked
  isUserBlocked: (userId) => {
    const state = get();
    return state.blockedUsers?.includes(userId) || false;
  },
}));