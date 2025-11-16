import express from "express";

import {
  createRequest,
  getAllRequests,
  getRequestById,
} from "../controllers/requestController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createRequest);
router.get("/", authenticate, getAllRequests);
router.get("/user", authenticate, getRequestById);

export default router;
