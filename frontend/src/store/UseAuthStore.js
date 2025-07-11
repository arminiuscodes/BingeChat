import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

export const UseAuthStore = create(
  persist(
    (set, get) => ({
      authUser: null,
      isSigninUp: false,
      isLoggingIn: false,
      isUpdatingProfile: false,
      isCheckingAuth: true,
      onlineUsers: [],
      socket: null,

      checkAuth: async () => {
        try {
          const res = await axiosInstance.get("/auth/check");
          set({ authUser: res.data });
          get().connectSocket();
        } catch (error) {
          console.log("Error in auth", error);
          set({ authUser: null });
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      signUp: async (data) => {
        set({ isSigninUp: true });
        try {
          const res = await axiosInstance.post("/auth/signup", data);
          set({ authUser: res.data });
          toast.success("Account Created Successfully!");
          get().connectSocket();
        } catch (error) {
          toast.error(error.response?.data?.message);
        } finally {
          set({ isSigninUp: false });
        }
      },

      login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data });
          toast.success("Logged in successfully");
          get().connectSocket();
        } catch (error) {
          toast.error(error.response?.data?.message);
        } finally {
          set({ isLoggingIn: false });
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          set({ authUser: null });
          get().disconnectSocket();
          toast.success("Logged Out successfully.");
        } catch (error) {
          toast.error(error.response?.data?.message);
        }
      },

      updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.put("/auth/update-profile", data);
          set({ authUser: res.data });

          if (data.fullName && !data.profilePic) {
            toast.success("Full name updated successfully!");
          } else if (data.fullName && data.profilePic) {
            toast.success("Profile and full name updated!");
          } else {
            toast.success("Profile picture updated!");
          }
        } catch (error) {
          console.log("Error in update profile:", error);
          toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
          set({ isUpdatingProfile: false });
        }
      },

      connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, {
          query: { userId: authUser._id },
        });
        socket.connect();
        set({ socket });
        socket.on("getOnlineUsers", (userIds) => {
          set({ onlineUsers: userIds });
        });
      },

      disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
      },
    }),
    {
      name: "auth-storage", // LocalStorage key
      getStorage: () => localStorage,
      partialize: (state) => ({ authUser: state.authUser }), // Only persist authUser
    }
  )
);
