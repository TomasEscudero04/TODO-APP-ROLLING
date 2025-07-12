const API = "http://localhost:3003/api/v1/auth";
const getToken = () => localStorage.getItem("token");
import axios from "axios";

const config = {
     headers: {
            Authorization: `Bearer ${getToken()}`,
        },
};

export const createTask = async (FormData) => {
    const res = await axios.post(`${API}/tasks`, FormData, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "multipart/form-data",
            }
        });
    return res.data;
}

export const getTasks = async () => {
    const res = await axios.get(`${API}/tasks`, config);
    return res.data;
}

export const deleteTask = async (id) => {
    const res = await axios.delete(`${API}/tasks/${id}`, config);
    return res.data;
}

export const updateTask = async (id, FormData) => {
    const res = await axios.put(`${API}/tasks/${id}`, FormData, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data",
        }
    });
    return res.data;
}