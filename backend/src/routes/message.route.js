
import express from "express";
import { protectRoute,checkBlocked } from "../middlewares/auth.middleware.js";
import { 
    getMessages, 
    getUsersForSidebar, 
    sendMessage, 
    deleteMessage,
    getFriends,
    searchUsers,
    getReceivedFriendRequests,
    getSentFriendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    cancelFriendRequest,
    deleteChat
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/friends", protectRoute, getFriends);
router.get("/search-users", protectRoute, searchUsers);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute,checkBlocked, sendMessage);
router.delete("/:id", protectRoute, deleteMessage);
router.delete('/clear/:userId', protectRoute, deleteChat);

// Friend request routes
router.get("/friend-requests/received", protectRoute, getReceivedFriendRequests);
router.get("/friend-requests/sent", protectRoute, getSentFriendRequests);
router.post("/friend-requests/send", protectRoute, sendFriendRequest);
router.post("/friend-requests/accept", protectRoute, acceptFriendRequest);
router.post("/friend-requests/decline", protectRoute, declineFriendRequest);
router.post("/friend-requests/cancel", protectRoute, cancelFriendRequest);

export default router;
