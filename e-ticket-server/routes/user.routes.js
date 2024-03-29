import express from 'express';
import userController from '../controllers/user.controller.js';
import { verifyJwt } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', verifyJwt, userController.profile);
router.post('/register', userController.register);
router.post('/registerorganizer', userController.registerOrganizer);
router.post('/registerclient', userController.registerClient);
router.post('/login', userController.login);
router.get('/logout', verifyJwt, userController.logout);
router.get('/verify-email/:eticketjwt', userController.verifyEmail);
router.post('/reset-password-mail', userController.sendEmailResetPassword);
router.post('/reset-password/:eticketjwt', userController.resetPassWord);
router.get('/verifytoken/:eticketjwt', userController.verifytoken);

export default router;
