const API = "http://localhost:3003/api/v1";
const getToken = () => localStorage.getItem("token");
import axios from "axios";

export const register = async (userData) => {
    //register con axios
    const res = await axios.post(`${API}/register`, userData);
    return res.data;
}

export const login = async (data) => {
    //login con fetch
    const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    if (!res.ok) {
        throw new Error("Login failed :(");
    }
    const json = await res.json();

    //devuelvo el token y el usuario
    return {
        token: json.token,
        user: {
            id: json._id,
            name: json.name,
            email: json.email,
            profileImage: json.profileImage,
        }
    }
};

export const verifyToken = async () => {
    const res = await fetch(`${API}/verify-token`, {
       headers: {
        Authorization: `Bearer ${getToken()}`,
       } 
    });
    return res.ok;
};

export const profile = async () => {
    const res = await fetch(`${API}/profile`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        }
    });
    if (!res.ok) {
        throw new Error("Invalid token");
    }
    return await res.json();
}