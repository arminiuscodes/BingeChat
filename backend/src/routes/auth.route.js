import express from 'express'
import { checkAuth, login,logout,signup,updateProfile,blockUser,unblockUser,removeFriend,getBlockedUsers } from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)

router.put("/update-profile",protectRoute,updateProfile);
router.get("/check",protectRoute,checkAuth);
router.post("/block-user/:userId", protectRoute, blockUser);
router.post("/unblock-user/:userId", protectRoute, unblockUser);
router.delete("/remove-friend/:userId", protectRoute, removeFriend);
router.get("/blocked-users", protectRoute, getBlockedUsers);
export default router;