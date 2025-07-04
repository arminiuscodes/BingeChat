import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { UseAuthStore } from "./UseAuthStore.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isDeletingMessage: false,
  blockedUsers: [],
  friendRequests: [],
  sentRequests: [],
  searchResults: [],
  isSearching: false,
  isSendingRequest: false,
  isManagingRequest: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/friends");
      set({ users: res.data });
    } catch (error) {
      console.error("Error fetching friends:", error);
      set({ users: [] });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  searchUsers: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }
    set({ isSearching: true });
    try {
      const res = await axiosInstance.get(`/messages/search-users?query=${encodeURIComponent(query)}`);
      const { users } = get();
      const friendIds = users.map(user => user._id.toString());
      const filteredResults = res.data.filter(user => 
        user?._id && !friendIds.includes(user._id.toString())
      );
      console.log('Search users response:', filteredResults);
      set({ searchResults: filteredResults });
    } catch (error) {
      console.error("Error searching users:", error);
      set({ searchResults: [] });
    } finally {
      set({ isSearching: false });
    }
  },

  clearSearchResults: () => {
    set({ searchResults: [] });
  },

  getFriendRequests: async () => {
    try {
      const [receivedRes, sentRes] = await Promise.all([
        axiosInstance.get("/messages/friend-requests/received"),
        axiosInstance.get("/messages/friend-requests/sent")
      ]);
      // Enhanced filtering to ensure only valid objects
      const validReceivedRequests = receivedRes.data.filter(req => req.sender && req.sender._id);
      const validSentRequests = sentRes.data.filter(req => req.receiver && req.receiver._id);
      console.log('Fetched friend requests:', { received: validReceivedRequests, sent: validSentRequests });
      set({ 
        friendRequests: validReceivedRequests,
        sentRequests: validSentRequests 
      });
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      set({ 
        friendRequests: [],
        sentRequests: [] 
      });
    }
  },

  sendFriendRequest: async (userId) => {
    set({ isSendingRequest: true });
    try {
      await axiosInstance.post("/messages/friend-requests/send", { receiverId: userId });
      const userResponse = await axiosInstance.get(`/messages/search-users?query=${encodeURIComponent(userId)}`);
      const user = userResponse.data.find(u => u._id.toString() === userId.toString());
      if (user) {
        set(state => ({
          sentRequests: [...state.sentRequests, { _id: `temp-${userId}`, receiver: user }],
          searchResults: state.searchResults.filter(u => u._id.toString() !== userId.toString())
        }));
      }
      toast.success("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error(error.response?.data?.message || "Failed to send friend request");
    } finally {
      set({ isSendingRequest: false });
    }
  },

  acceptFriendRequest: async (requestId) => {
    set({ isManagingRequest: true });
    try {
      const res = await axiosInstance.post("/messages/friend-requests/accept", { requestId });
      set(state => ({
        friendRequests: state.friendRequests.filter(req => req._id !== requestId),
        users: [...state.users, res.data.friend]
      }));
      toast.success("Friend request accepted!");
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error(error.response?.data?.message || "Failed to accept friend request");
    } finally {
      set({ isManagingRequest: false });
    }
  },

  declineFriendRequest: async (requestId) => {
    set({ isManagingRequest: true });
    try {
      await axiosInstance.post("/messages/friend-requests/decline", { requestId });
      set(state => ({
        friendRequests: state.friendRequests.filter(req => req._id !== requestId)
      }));
      toast.success("Friend request declined");
    } catch (error) {
      console.error("Error declining friend request:", error);
      toast.error(error.response?.data?.message || "Failed to decline friend request");
    } finally {
      set({ isManagingRequest: false });
    }
  },

  cancelFriendRequest: async (requestId) => {
    set({ isManagingRequest: true });
    try {
      await axiosInstance.post("/messages/friend-requests/cancel", { requestId });
      set(state => ({
        sentRequests: state.sentRequests.filter(req => req._id !== requestId)
      }));
      toast.success("Friend request cancelled");
    } catch (error) {
      console.error("Error cancelling friend request:", error);
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
      console.error("Error fetching messages:", error);
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser || typeof selectedUser._id !== "string" || selectedUser._id.length !== 24) {
      toast.error("Invalid user selected to send message.");
      console.warn("Invalid selectedUser in sendMessage:", selectedUser);
      return;
    }
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.error("Error sending message:", error);
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
      console.error("Error deleting message:", error);
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

  clearChat: async (userId) => {
    try {
      const response = await axiosInstance.delete(`/messages/clear/${userId}`);
      set({ messages: [] });
      return response.data;
    } catch (error) {
      console.error('Error clearing chat:', error);
      throw error;
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  blockUser: async (userId) => {
    try {
      const res = await axiosInstance.post(`/auth/block-user/${userId}`);
      await get().getBlockedUsers();
      set((state) => ({
        selectedUser: state.selectedUser?._id === userId ? null : state.selectedUser,
        messages: state.selectedUser?._id === userId ? [] : state.messages,
      }));
      toast.success("User blocked successfully");
      return true;
    } catch (err) {
      console.error("Error blocking user:", err);
      toast.error(err.response?.data?.message || "Failed to block user");
      return false;
    }
  },

  unblockUser: async (userId) => {
    try {
      await axiosInstance.post(`/auth/unblock-user/${userId}`);
      await get().getBlockedUsers();
      toast.success("User unblocked successfully");
      return true;
    } catch (err) {
      console.error("Error unblocking user:", err);
      toast.error(err.response?.data?.message || "Failed to unblock user");
      return false;
    }
  },

  removeFriend: async (userId) => {
    try {
      const res = await axiosInstance.delete(`/auth/remove-friend/${userId}`);
      set((state) => ({
        users: state.users.filter((u) => u._id !== userId),
        selectedUser: state.selectedUser?._id === userId ? null : state.selectedUser,
        messages: state.selectedUser?._id === userId ? [] : state.messages,
      }));
      toast.success("Friend removed successfully");
      return res.data;
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error(error.response?.data?.message || "Failed to remove friend");
      throw error;
    }
  },

  getBlockedUsers: async () => {
    try {
      const res = await axiosInstance.get("/auth/blocked-users");
      set({ blockedUsers: res.data.blockedUsers.map((u) => u._id) });
    } catch (err) {
      console.error("Error fetching blocked users:", err);
      set({ blockedUsers: [] });
    }
  },

  isUserBlocked: (userId) => {
    const state = get();
    return state.blockedUsers?.includes(userId) || false;
  },
}));