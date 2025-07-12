import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto"; //Para generar un token aleatorio
import { createAccessToken } from "../helpers/jwt.js";
import transport from "../helpers/mailer.js";
import jwt from "jsonwebtoken";
import { success } from "zod/v4";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body; //Preparo la informacion que envia el cliente
    const userFound = await User.findOne({ email }); //Busco si el usuario ya existe en la base de datos

    if (userFound) {
      return res.status(400).json({ message: "User already exists" });
    } //Si el usuario ya existe, devuelvo un error 400

    const passwordHash = await bcrypt.hash(password, 12); //Encripto la contraseña con un hash de 12 rondas

    //Generar token de verificación
    const verificationToken = crypto.randomBytes(20).toString("hex"); //Genera un token aleatorio de 40 caracteres hexadecimales

    const newUser = new User({
      username,
      email,
      password: passwordHash,
      verificationToken, //Guardo el token de verificación en la base de datos
    });

    const savedUser = await newUser.save(); //Guardo el usuario en la base de datos

    // 1- Enviar correo de verificación
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`; //Creo el link de verificación

    await transport.sendMail({
      from: process.env.MAIL_FROM,
      to: savedUser.email,
      subjet: "Verifica tu email - ROLLING TODO_APP",
      template: "verifyEmail",
      context: {
        username: savedUser.username,
        verificationLink,
      },
    });
    // 2- Crear el token
    const token = await createAccessToken({
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
    }); //Creo un token de acceso

    // 3- Enviar respuesta al cliente con cookie
    res.cookie("token", token, {
      httpOnly: process.env.NODe_ENV !== "production",
      secure: true,
      sameSite: "none",
    });

    // 4- Enviar respuesta al cliente
    res.status(201).json({
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      isVerified: savedUser.isVerified,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userFound = await User.findOne({ email }); //Busco al usuario en mongo

    if (!userFound) {
      return res.status(400).json({ message: "User not found" });
    } //Si no existe el usuario, devuelvo un error 400

    const isMatch = await bcrypt.compare(password, userFound.password); //Comparo la contraseña ingresada con la contraseña encriptada en mongo

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    } //Si las contraseñas no coinciden, devuelvo un error 400

    const token = await createAccessToken({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    }); //Creo un token de acceso

    // Enviar respuesta al cliente con cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // Enviar respuesta al cliente
    res.status(200).json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      isVerified: userFound.isVerified,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    //limpiar la cookie para matar la sesion
    res.cookie("token", "", { expires: new Date(0) }); //limpio seteandola con un string vacio y con una fecha de expiración en el pasado
    res.status(200).json({ message: "Logout Success!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const profile = async (req, res) => {
  try {
    const userFound = await User.findById(req.user.id);

    if (!userFound) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      profileImage: userFound.profileImage,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const verifyToken = async (req, res) => {
  try {

    let token;
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    } else {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY); //Verifico el token
    const userFound = await User.findById(decoded.id);

    if (!userFound) {
      return res.status(401);
    }
    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      isVerified: userFound.isVerified,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
    try {
        const {token} = req.query;

        const user = await User.findOne({verificationToken:token});

        if (!user) {
            return res.status(400).json({message: "Token not valid or expired"});
        }

        user.isVerified = true; //Actualizo el estado de verificación del usuario
        user.verificationToken = undefined; //Elimino el token de verificación para que no se pueda usar nuevamente
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully!",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isVerified: user.isVerified
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
        
    }
}
