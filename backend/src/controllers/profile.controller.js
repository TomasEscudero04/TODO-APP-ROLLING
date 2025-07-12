import {User} from '../models/user.model.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

//obtener el __dirname en ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadProfileImage = async (req, res) => {
    try {
        if (req.fileValidationError) {
            return res.status(400).json({message: req.fileValidationError})
        } //valido en caso de que se haya subido un archivo que no sea una imagen
        if (!req.file) {
            return res.status(400).json({message: "No file uploaded"}); 
        } //valido que se haya subido un archivo


        const userId = req.user.id; //obtengo el id del usuario logueado

        const user = await User.findById(userId); //busco al usuario en la base de datos

        //si no hay usuario, debo borrar la imagen que se subió
        if (!user) {
            fs.existsSync(path.join(__dirname, `../../public/uploads/profile/${req.file.filename}`)) && fs.unlinkSync(path.join(__dirname, `../../public/uploads/profile/${req.file.filename}`));
            //si hay un error con el usuario, este código borra la imagen que se subió

            return res.status(4004).json({message: "User not found"});
        }

        //si el usuario tiene imagen de perfil, la borro
        if (user.profileImage) {
            const oldImagePath = path.join(__dirname, '../../public/uploads/profile', path.basename(user.profileImage))
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath); //borro la imagen anterior
            }
        }

        //actualizo la imagen de perfil del usuario
        const imageUrl = `/uploads/profile/${req.file.filename}`;

        user.profileImage = imageUrl;

        await user.save(); //actualizo el usuario en MongoDB

        res.status(200).json({
            message: "Profile image uploaded successfully",
            profileImage: imageUrl //devuelvo la url de la imagen de perfil
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error uploading profile image"});
    }
}

export const getProfileImage = async (req, res) => {
    try {
        const userId = req.user.id; //obtengo la info del usuario a traves del middleware de authrequired quien inyecta esta info desde el token
        const user = await User.findById(userId); //busco al usuario en la base de datos

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        if (!user.profileImage) {
            return res.status(404).json({message: "User does not have a profile image"});
        }

        res.status(200).json({
            profileImage: user.profileImage //devuelvo la url de la imagen de perfil
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error  getting profile image"});
    }
}