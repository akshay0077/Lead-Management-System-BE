import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { deleteLeads, getAllLeads, leadExport, leadImport, leadsCreate, singleLeadGet, updateLeads } from '../controllers/leadController.js';
import { uploadMiddleware } from '../middlewares/uploadMiddleware.js';

//create a seprate router object
const router = express.Router();

//Login Router and Method is POST
router.post("/create-lead", leadsCreate)
router.get("/single-lead/:id", singleLeadGet)
router.get("/all-leads", getAllLeads)
router.put("/update-lead/:id", updateLeads)
router.delete("/delete-lead/:id", deleteLeads)
router.get("/leadexport", leadExport);
router.post("/leadimport", uploadMiddleware, leadImport);

//protected route for the User
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true })
});

//protected route for the Admin
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true })
});

export default router;