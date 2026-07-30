import env from "../config/env";

export const getImageUrl = (path) => {
    if (!path) return null;

    return `${env.STORAGE_URL}/${path}`;
};