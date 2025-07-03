import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import mongoose from 'mongoose';

export const protectRoute = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({success:false,message:"Unauthorized , No token provided !"})
        }
        const decoded =jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded){
            return res.status(400).json({success:false,message:"Unauthorized - Invalid token"})
        }
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(404).json({success:false,message:"User not found!"});
        }
        req.user =user
        next();
    } catch (error) {
        console.error("Error in protectRoute",error.message);
        res.status(500).json({success:false,message:"server error"});
    }
};

export const checkBlocked = async (req, res, next) => {
  try {
    const { id: targetUserId } = req.params;
    const currentUserId = req.user._id;

    // ✅ Validate target user ID
    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      console.warn("❌ Invalid targetUserId:", targetUserId);
      return res.status(400).json({ success: false, message: "Invalid target user ID" });
    }

    // ✅ Get both users with their blocked lists
    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserId).select("blockedUsers"),
      User.findById(targetUserId).select("blockedUsers")
    ]);

    if (!currentUser || !targetUser) {
      console.warn("❌ One of the users does not exist:", currentUserId, targetUserId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Check if current user has blocked the target user
    const hasBlockedTarget = currentUser.blockedUsers && currentUser.blockedUsers.some(
      (id) => id.toString() === targetUserId
    );

    // ✅ Check if target user has blocked the current user
    const isBlockedByTarget = targetUser.blockedUsers && targetUser.blockedUsers.some(
      (id) => id.toString() === currentUserId.toString()
    );

    // ✅ If either user has blocked the other, prevent messaging
    if (hasBlockedTarget || isBlockedByTarget) {
      console.log(`🚫 Messaging blocked: ${currentUserId} <-> ${targetUserId}`);
      return res.status(403).json({
        success: false,
        message: "You cannot message this user because one of you has blocked the other.",
      });
    }

    // ✅ If not blocked, allow the request to proceed
    next();
  } catch (err) {
    console.error("🔥 checkBlocked middleware error:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};