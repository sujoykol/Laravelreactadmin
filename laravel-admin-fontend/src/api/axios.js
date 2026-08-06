import axios from "axios";
import env from "../config/env";


const api = axios.create({
    baseURL: env.API_URL,
    headers:{
        "Content-Type":"application/json"
    }
});


// Attach access token
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


// Refresh token handling
api.interceptors.response.use(

    (response)=>{
        return response;
    },


    async(error)=>{


        const originalRequest = error.config;


        if(
            error.response?.status === 401 &&
            !originalRequest._retry
        ){

            originalRequest._retry = true;


            try{

                const refreshToken =
                localStorage.getItem("refresh_token");


                const response = await axios.post(

                    `${env.API_URL}/auth/refresh`,

                    {
                        refresh_token: refreshToken
                    }

                );


                const newAccessToken =
                response.data.access_token;


                localStorage.setItem(
                    "access_token",
                    newAccessToken
                );


                // update current request
                originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;


                // retry failed request
                return api(originalRequest);


            }
            catch(refreshError){


                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("user");
                localStorage.removeItem("permissions");


                window.location.href="/login";


                return Promise.reject(refreshError);
            }

        }


        return Promise.reject(error);

    }

);


export default api;