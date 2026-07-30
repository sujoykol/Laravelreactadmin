import api from "../api/axios";


export const loginUser = async(data)=>{

    const response = await api.post(
        "/login/",
        data
    );

    return response.data;

};


export const changePassword = async (data) => {
    try {
        const response = await api.post(
            "/change-password",
            data
        );

        return response.data;

    } catch (err) {
        console.log(err.response);
        throw err;
    }
};

export const registerUser = async(data)=>{

    const response = await api.post(
        "/register/",
        data
    );

    return response.data;

};