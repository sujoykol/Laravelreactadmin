import api from "../api/axios";

export const getCustomers = async () => {
    const response = await api.get("/customers");
    return response.data;
};

export const createCustomer = async (formData) => {
    const response = await api.post(
        "/customers",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const getCustomer = async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
};

export const updateCustomer = async (id, formData) => {
    const response = await api.post(
        `/customers/${id}?_method=PUT`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const deleteCustomer = async (id) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
};

export const toggleCustomerStatus = async (id) => {
    const response = await api.patch(
        `/customers/${id}/toggle-status`
    );

    return response.data;
};