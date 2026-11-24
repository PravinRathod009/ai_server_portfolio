import { Router } from "express";
import { getModes, handleChat } from "../controllers/chat.controller.js";

const router = Router();

router.get("/modes", getModes);
router.post("/", handleChat);

export default router;
