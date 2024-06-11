import { uploadMiddleware } from '../middlewares/uploadMiddleware.js';
import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  deleteLeads,
  getAllLeads,
  leadExport,
  leadImport,
  leadsCreate,
  updateLeads,
} from "../controllers/leadController.js";
import multer from "multer";

//create a seprate router object
const router = express.Router();

const upload = multer({ dest: "./public/files/import" });

//Login Router and Method is POST
router.post("/create-lead", leadsCreate);
router.get("/all-leads", getAllLeads);
router.put("/update-lead/:id", updateLeads);
router.delete("/delete-lead/:id", deleteLeads);
router.get("/leadexport", leadExport);
router.post("/leadimport", upload.single("file"), leadImport);

//protected route for the User
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected route for the Admin
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;
