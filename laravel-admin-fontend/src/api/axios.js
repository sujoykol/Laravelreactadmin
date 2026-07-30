import axios from "axios";
import env from "../config/env";


const api = axios.create({
    baseURL: env.API_URL,
    headers:{
        "Content-Type":"application/json"
    }
});


api.interceptors.request.use(
    (config)=>{

        const token = localStorage.getItem("access_token");

        if(token){
            config.headers.Authorization =
            `Bearer ${token}`;
        }

        return config;
    },

    (error)=>{
        return Promise.reject(error);
    }
);


export default api;