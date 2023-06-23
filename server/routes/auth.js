import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login); // this is /auth/login

export default router;


// we are creating different routes , so when the user click on a specific things,
// a specific api gets hits and do a specific operation