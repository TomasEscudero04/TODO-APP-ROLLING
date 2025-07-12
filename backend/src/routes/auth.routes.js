import express from 'express';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';
import { login, logout, profile, register, verifyToken, verifyEmail } from '../controllers/auth.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import uploadIconProfileImage from '../helpers/multer.config.iconProfile.js';
import { getProfileImage, uploadProfileImage } from '../controllers/profile.controller.js';
import { requestPasswordReset, resetPassword } from '../controllers/passwordReset.controller.js';

const router = express.Router(); //crear una instancia de router

router.post('/register', validateSchema(registerSchema), register);
router.post('/login', validateSchema(loginSchema), login);
router.post('/logout', logout);
router.get('/profile', authRequired, profile);
router.get('/verify-token', verifyToken);
router.get('/verify-email', verifyEmail);

//ruta para solicitar el reset de la password
router.post('/request-password-reset', requestPasswordReset);

//ruta para actualizar la password
router.post('/reset-password/:token', resetPassword);


//rutas para la imagen de perfil del usuario
router.post('/upload-profile-image',
    authRequired,
    uploadIconProfileImage.single("iconProfile"),//sube una imagen de perfil con el nombre de campo "iconProfile". TIENE QUE COINCIDIR CON EL NOMBRE DEL CAMPO EN EL FORMULARIO
    uploadProfileImage 
) ///sube la imagen

router.get('/profile-image', authRequired, getProfileImage) //pide la imagen

export default router;