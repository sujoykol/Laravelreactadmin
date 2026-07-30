import api from "../api/axios";

export const getProducts = async (page = 1) => {
    const response = await api.get(`/products?page=${page}`);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
};

export const toggleProductStatus = async (id) => {
    const response = await api.patch(`/products/${id}/toggle-status`);
    return response.data;
};

export const getProduct = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

export const createProduct = async (formData) => {
    const response = await api.post("/products", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const updateProduct = async (id, formData) => {
    formData.append("_method", "PUT");

    const response = await api.post(`/products/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};