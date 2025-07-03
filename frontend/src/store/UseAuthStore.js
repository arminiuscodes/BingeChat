import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE==="development"? "http://localhost:5000":"/"; // Adjust this to your backend URL
// Initialize socket connection
export const UseAuthStore = create((set,get)=>({
    authUser:null,// initially it is null because we do not know user is authenticated or not , we we will check for it.
    isSigninUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,

    isCheckingAuth:true,
    onlineUsers:[],
    socket:null, // Socket instance will be stored here

    checkAuth:async()=>{
        try {
            const res =await axiosInstance.get("/auth/check");
            set({authUser:res.data})
            get().connectSocket(); // Connect socket after checking auth
        } catch (error) {
            console.log("Error in auth",error)
            set({authUser:null});
        }finally{
            set({isCheckingAuth:false});
        }
    },
    signUp :async(data)=>{
        set({isSigninUp:true})
       try {
          const res=await axiosInstance.post("/auth/signup",data);
          set({authUser:res.data})
          toast.success("Account Created Successfully!");
          get().connectSocket(); // Connect socket after signup
          
       } catch (error) {
        toast.error(error.response.data.message)
       }finally{
        set({isSigninUp:false});
       }
    },

    logout:async()=>{
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged Out successfully.")
            get().disconnectSocket(); // Disconnect socket on logout
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    login:async(data)=>{
        set({isLoggingIn:true});
        try {
            const res= await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            toast.success("Logged in successfully");
            get().connectSocket(); // Connect socket after login
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isLoggingIn:false})
        }
    },
   updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
        const res = await axiosInstance.put("/auth/update-profile", data);
        set({ authUser: res.data });

        // Smart toast logic
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
   connectSocket:()=>{
    const{authUser}=get();
    if(!authUser || get().socket?.connected) return; // Do not connect socket if user is not authenticated
    const socket=io(BASE_URL,{
        query:{
            userId:authUser._id // Pass user ID as query parameter
        },
    })
    socket.connect();
    set({socket:socket});
    socket.on("getOnlineUsers",(userIds)=>{
        set({onlineUsers:userIds});
    });
   },

   disconnectSocket:()=>{
    if(get().socket?.connected) get().socket.disconnect();
   }
}));

