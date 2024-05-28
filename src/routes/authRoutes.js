import express from 'express'
import {loginController, registerController} from '../controllers/authController.js'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

//create a seprate router object
const router = express.Router();

//Login Router and Method is POST
router.post("/login",loginController)
router.post("/register", registerController)

//protected route for the User
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true })
});

//protected route for the Admin
router.get('/admin-auth', requireSignIn, isAdmin,(req, res) => {
    res.status(200).send({ ok: true })
});

export default router;