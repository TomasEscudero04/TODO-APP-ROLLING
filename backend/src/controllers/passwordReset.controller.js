import { User } from '../models/user.model.js';
import { createAccessToken } from '../helpers/jwt.js';
import transport from '../helpers/mailer.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { email } from 'zod/v4';

export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        // 1- validar el email
        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        // 2- buscar el usuario por email
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // 3- generar el token de reset para la password
        const resetToken = await createAccessToken({
            id: user._id,
            purpose: 'password-reset'
        })
        
        // 4- guardar el token y la fecha de expiracion
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hora de expiración
        await user.save();

        // 5- enviar el mail con el link de reset
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: `"${process.env.APP_NAME}"` || `"TODO-APP" <${process.env.MAIL_USER}>`,
            to: user.email,
            subject: 'Reset password instructions',
            template: 'forgotPassword', //pongo el nombre del archivo pero sin la extension
            context: {
                name: user.username,
                link: resetLink,
                subject: 'Reset your password', 
            }
        }
        await transport.sendMail(mailOptions);

        // 6- enviar la respuesta al cliente 
        res.status(200).json({
            message: 'Password reset instructions sent to your email.',
            expiresIn: '1 hour',
        });

    } catch (error) {
        console.error('Error in requestPasswordReset:', {
            error: error.message,
            stack: error.stack,
            email: req.body.email
        });

        res.status(500).json({
            message: 'Error to process your request.',
            error: error.message
        });
        
    }
}

export const resetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const {newPassword} = req.body;

        // 1- verificar el token
        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: 'Invalid or expired token.',
                    error: err.message
                });
            }
                
        // 2- buscar el usuario por el token
        const user = await User.findOne({
            _id: decoded.id,
            passwordResetToken: token,
            passwordResetExpires: {$gt: Date.now()} // verificar que no haya expirado
        });

        if (!user) {
            return res.status(400).json({
                message: 'User not found or token expired.'
            });
        }

        // 3- hashear la nueva password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // 4- actualizar y limpiar token
        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        // 5- enviar la respuesta al cliente
        res.status(200).json({
            message: 'Password reset successfully.'
        });
        })


    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({
            message: 'Error to reset your password.',
            error: error.message
        });
    }
}