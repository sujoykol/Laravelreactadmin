import api from "../api/axios";

export const getRoles = async () => {
    const response = await api.get("/roles");
    return response.data;
};

export const getPermissions = async () => {
    const response = await api.get("/permissions");
    return response.data;
};

export const createRole = async (data) => {
    const response = await api.post("/roles", data);
    return response.data;
};

export const updateRole = async (id, data) => {
    const response = await api.put(`/roles/${id}`, data);
    return response.data;
};

export const deleteRole = async (id) => {
    const response = await api.delete(`/roles/${id}`);
    return response.data;
    
};

export const givePermission = async (id, permission) => {
    const response = await api.post(
        `/roles/${id}/give-permission`,
        { permission }
    );

    return response.data;
};

export const revokePermission = async (id, permission) => {
    const response = await api.post(
        `/roles/${id}/revoke-permission`,
        { permission }
    );

    return response.data;
};