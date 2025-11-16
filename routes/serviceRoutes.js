import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  deactivateService,
} from "../controllers/serviceController.js";

import express from "express";
const router = express.Router();

router.post("/", createService);
router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.put("/:id", updateService);
router.delete("/:id", deleteService);
router.patch("/:id/deactivate", deactivateService);

export default router;
