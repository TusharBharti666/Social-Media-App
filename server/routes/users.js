import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
}
from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";


const router = express.Router();

// READ //
router.get("/:id", verifyToken, getUser);  // we are grabbing the user with particular id
router.get("/:id/friends", verifyToken, getUserFriends); // showing user's friend with the help of the id


//UPDATE //
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;