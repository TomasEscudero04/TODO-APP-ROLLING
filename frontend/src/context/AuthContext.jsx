import { createContext, useContext, useState, useEffect, use } from "react";
import * as authService from "../services/authService";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

const [user, setUser] = useState(null);
const [profileImage, setProfileImage] = useState(null);
const [loading, setLoading] = useState(true);

const getToken = () => localStorage.getItem('token');

const register = async (userData) => {
    return await authService.register(userData);
}

const login = async (credentials) => {
    const {token, user} = await authService.login(credentials);
    console.log("Login OK - Token:", token);
    setUser(user);
    await getProfile(); // carga la imagen y el perfil actualizados
}

const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    setProfileImage(null);
    await fetch("http://localhost:3003/api/v1/logout", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    })
}

const getProfile = async () => {
    const token = getToken();

    if (!token) {
        console.log("Token not found");
        return
    }
    const data = await authService.profile();
    setUser(data);

    //si hay una imagen, armar la URL para mostrarla en el navegador
    if (data.profileImage) {
        setProfileImage(`http://localhost:3003${data.profileImage}`);
    }
}

//useEffect que solo se ejecuta si hay un token ya guardado
useEffect(() => {
    const token = getToken();
    console.log("Token to initialize");

    if (!token) {
        setLoading(false);
        return;
    }
    const init = async () => {
        try {
            const valid = await authService.verifyToken();
            console.log("Token valid:", valid);
            if (valid) {
                await getProfile();
            } else {
                logout()
            }
        } catch (error) {
            console.log("Error verifying token:", error);
            logout();
        } finally {
            setLoading(false);
        }
    };
    init();

}, []);


    return(
        <AuthContext.Provider
         value={{
            user,
            register,
            login,
            logout,
            profileImage,
            getProfile,
            loading
         }}
         >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);