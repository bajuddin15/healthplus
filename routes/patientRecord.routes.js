import express from "express";
import {
  createPatientRecord,
  deletePatientRecord,
  editPatientRecord,
  getAllPatientRecords,
} from "../controllers/patientRecord.controllers.js";
import { protectRoute } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/create", protectRoute, createPatientRecord);
router.put("/edit/:id", protectRoute, editPatientRecord);
router.delete("/delete/:id", protectRoute, deletePatientRecord);
router.get("/", protectRoute, getAllPatientRecords);

export default router;
