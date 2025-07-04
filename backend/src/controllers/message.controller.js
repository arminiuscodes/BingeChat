import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import FriendRequest from "../models/friendRequest.model.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";
import mongoose from "mongoose"; // ✅ Added missing import

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedUserId}}).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar", error.message);
        res.status(500).json({success: false, message: "server error!"});
    }
};

export const getFriends = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('friends', '-password');
        res.status(200).json(user.friends || []);
    } catch (error) {
        console.error("Error in getFriends", error.message);
        res.status(500).json({success: false, message: "server error!"});
    }
};
export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const userId = req.user._id;
        
        if (!query) {
            return res.status(200).json([]);
        }

        const users = await User.find({
            $and: [
                { _id: { $ne: userId } },
                {
                    $or: [
                        { username: { $regex: query, $options: 'i' } },
                        { fullName: { $regex: query, $options: 'i' } }
                    ]
                }
            ]
        }).select('-password').limit(10).lean(); // Add .lean() for better performance

        // Ensure all required fields are present
        const completeUsers = users.map(user => ({
            _id: user._id,
            fullName: user.fullName || '',
            username: user.username || '',
            profilePic: user.profilePic || '/avatar.png'
        }));

        res.status(200).json(completeUsers);
    } catch (error) {
        console.error("Error in searchUsers", error.message);
        res.status(500).json({success: false, message: "server error!"});
    }
};
export const getReceivedFriendRequests = async (req, res) => {
    try {
        const userId = req.user._id;
        const requests = await FriendRequest.find({
            receiver: userId,
            status: 'pending'
        })
        .populate('sender', '-password');
        
        res.status(200).json(requests);
    } catch (error) {
        console.error("Error in getReceivedFriendRequests", error.message);
        res.status(500).json({success: false, message: "server error!"});
    }
};

export const getSentFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await FriendRequest.find({
      sender: userId,
      status: 'pending'
    }).populate({
      path: 'receiver',
      select: '-password',
      match: { _id: { $exists: true } } // Ensure receiver exists
    });

    // Filter out requests where receiver is null (e.g., deleted users)
    const validRequests = requests.filter(request => request.receiver !== null);
    
    res.status(200).json(validRequests);
  } catch (error) {
    console.error("Error in getSentFriendRequests", error.message);
    res.status(500).json({ success: false, message: "server error!" });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;

    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ message: "Cannot send friend request to yourself" });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if they are already friends
    const currentUser = await User.findById(senderId);
    if (currentUser.friends.includes(receiverId)) {
      return res.status(400).json({ message: "Already friends with this user" });
    }

    // ✅ Only block if a pending request exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId, status: "pending" },
        { sender: receiverId, receiver: senderId, status: "pending" }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already exists" });
    }

    // 🧹 Cleanup old declined/accepted requests
    await FriendRequest.deleteMany({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ],
      status: { $in: ["declined", "accepted"] }
    });

    // ✅ Create new friend request
    const newRequest = new FriendRequest({
      sender: senderId,
      receiver: receiverId
    });

    await newRequest.save();

    res.status(201).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Error in sendFriendRequest", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        const userId = req.user._id;

        const friendRequest = await FriendRequest.findById(requestId).populate('sender', '-password');
        
        if (!friendRequest || friendRequest.receiver.toString() !== userId.toString()) {
            return res.status(404).json({message: "Friend request not found"});
        }

        // Add each other as friends
        await User.findByIdAndUpdate(userId, {
            $addToSet: { friends: friendRequest.sender._id }
        });
        
        await User.findByIdAndUpdate(friendRequest.sender._id, {
            $addToSet: { friends: userId }
        });

        // Update request status
        friendRequest.status = 'accepted';
        await friendRequest.save();

        res.status(200).json({
            message: "Friend request accepted",
            friend: friendRequest.sender
        });
    } catch (error) {
        console.error("Error in acceptFriendRequest", error.message);
        res.status(500).json({success: false, message: "server error!"});
    }
};

export const declineFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        const userId = req.user._id;

        const friendRequest = await FriendRequest.findById(requestId);
        
        if (!friendRequest || friendRequest.receiver.toString() !== userId.toString()) {
            return res.status(404).json({message: "Friend request not found"});
        }

        friendRequest.status = 'declined';
        await friendRequest.save();

        res.status(200).json({message: "Friend request declined"});
    } catch (error) {
        console.error("Error in declineFriendRequest", error.message);
        res.status(500).json({success: false, message: "server error!"});
    }
};

export const cancelFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        const userId = req.user._id;

        const friendRequest = await FriendRequest.findById(requestId);
        
        if (!friendRequest || friendRequest.sender.toString() !== userId.toString()) {
            return res.status(404).json({message: "Friend request not found"});
        }

        await FriendRequest.findByIdAndDelete(requestId);
        res.status(200).json({message: "Friend request cancelled"});
    } catch (error) {
        console.error("Error in cancelFriendRequest", error.message);
        res.status(500).json({success: false, message: "server error!"});
    }
};

export const getMessages = async (req, res) => {
    try {
        const {id: userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        });
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages", error.message);
        res.status(500).json({success: false, message: "internal server error."})
    }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // ✅ Validate receiver ID
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      console.warn("❌ Invalid receiverId:", receiverId);
      return res.status(400).json({ success: false, message: "Invalid recipient ID" });
    }

    // ✅ Check if recipient exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      console.warn("❌ Recipient user not found:", receiverId);
      return res.status(404).json({ success: false, message: "Recipient user does not exist" });
    }

    // ✅ Upload image if included
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // ✅ Emit real-time message to recipient if online
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("🔥 Error in sendMessage controller:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const deleteMessage = async (req, res) => {
    try {
        const { id: messageId } = req.params;
        const userId = req.user._id;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({message: "Message not found"});
        }

        if (message.senderId.toString() !== userId.toString()) {
            return res.status(403).json({message: "Not authorized to delete this message"});
        }

        await Message.findByIdAndDelete(messageId);
        res.status(200).json({message: "Message deleted successfully"});
    } catch (error) {
        console.error("Error in deleteMessage", error.message);
        res.status(500).json({success: false, message: "server error!"});
    }
};

// Delete/Clear chat between two users
export const deleteChat = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Delete all messages between the two users
    const result = await Message.deleteMany({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId }
      ]
    });

    res.status(200).json({
      success: true,
      message: `Chat cleared successfully. ${result.deletedCount} messages deleted.`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Error in deleteChat controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Failed to clear chat.'
    });
  }
};