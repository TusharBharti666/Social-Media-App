import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();


// READ //

router.get("/", verifyToken, getFeedPosts); // we are giving the user , the whole feed 
router.get("/:userId/posts", verifyToken, getUserPosts); // showing the feed of a friend on whom's id we have clicked on


// UPDATES

router.patch("/:id/like", verifyToken, likePost); // add and remove like

export default router;