import api from "../api/axios";

export const getSliders = async (page = 1) => {
    const response = await api.get(`/sliders?page=${page}`);
    return response.data;
};

export const getSlider = async (id) => {
    const response = await api.get(`/sliders/${id}`);
    return response.data;
};

export const createSlider = async (formData) => {
    const response = await api.post(
        "/sliders",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const updateSlider = async (id, formData) => {
    const response = await api.post(
        `/sliders/${id}?_method=PUT`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const deleteSlider = async (id) => {
    const response = await api.delete(`/sliders/${id}`);
    return response.data;
};

export const toggleSliderStatus = async (id) => {
    const response = await api.patch(`/sliders/${id}/toggle-status`);
    return response.data;
};