import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup =async (req,res)=>{
    const {email,password,fullName}=req.body;
   try {
    if(!fullName||!password||!email){
        return res.status(400).json({success:false,message:"all fields are required!"});
    }
    if(password.length<6){
        return res.status(400).json({success:false,message:"Password length must be at least 6 characters!"});
    }
    const user =await User.findOne({email});
    if(user){
        return res.status(400).json({success:false,message:"Email already exists"})
    }
    const hashedPass = await bcrypt.hash(password,10);
    const newUser = new User({
        fullName:fullName,
        password:hashedPass,
        email:email,
    
    });
    if(newUser){
        //generate token 
        generateToken(newUser._id,res)
        await newUser.save();
        res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            email:newUser.email,
            profilePic:newUser.profilePic,
        });

    }else{
        res.status(400).json({success:false,message:"Invalid User data!"})
    }

   } catch (error) {
       console.error("Error in signup controller",error.message);
       res.status(500).json({success:false,message:"Internal Server Error"})
   }
}
export const login =async (req,res)=>{
    const{email,password}=req.body;

    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message:"Invalid Credentials !"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({success:false,message:"Incorrect Password!"})
        }
        generateToken(user._id,res)
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
        })

    } catch (error) {
        console.error("Error in login controller",error.message);
        res.status(500).json({success:false,message:"Server error!"})
    }
}
export const logout =async (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
        console.error("Error in logout controller",error.message);
        res.status(500).json({success:false,message:"server error"})
    }
};
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, fullName } = req.body;
    const userId = req.user._id;

    const updateData = {};

    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      updateData.profilePic = uploadResponse.secure_url;
    }

    if (fullName) {
      updateData.fullName = fullName;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = async (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.error("Error in checkAuth controller",error.message);
        res.status(500).json({success:false,message:"server error"})
    }
}

// Block user
export const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (!userId || userId === currentUserId.toString()) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const userToBlock = await User.findById(userId);
    if (!userToBlock) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const updated = await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { blockedUsers: userId }
    }, { new: true });

    if (!updated) {
      return res.status(500).json({ success: false, message: "Failed to block user" });
    }

    res.status(200).json({ success: true, message: "User blocked successfully" });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Unblock user
export const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (!userId || userId === currentUserId.toString()) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    await User.findByIdAndUpdate(currentUserId, {
      $pull: { blockedUsers: userId }
    });

    res.status(200).json({ success: true, message: "User unblocked successfully" });
  } catch (error) {
    console.error("Error unblocking user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Remove friend
export const removeFriend = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (!userId || userId === currentUserId.toString()) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const userToRemove = await User.findById(userId);
    if (!userToRemove) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await User.findByIdAndUpdate(currentUserId, {
      $pull: { friends: userId }
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { friends: currentUserId }
    });

    res.status(200).json({ success: true, message: "Friend removed successfully" });
  } catch (error) {
    console.error("Error removing friend:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get blocked users
export const getBlockedUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const user = await User.findById(currentUserId)
      .populate("blockedUsers", "fullName profilePic email")
      .select("blockedUsers");

    res.status(200).json({
      success: true,
      blockedUsers: user.blockedUsers || []
    });
  } catch (error) {
    console.error("Error fetching blocked users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

