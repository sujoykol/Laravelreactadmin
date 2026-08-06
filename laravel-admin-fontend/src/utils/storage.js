export const setToken = (accessToken, refreshToken) => {

    localStorage.setItem(
        "access_token",
        accessToken
    );

    localStorage.setItem(
        "refresh_token",
        refreshToken
    );

};


export const getToken = () => {
    return localStorage.getItem("access_token");
};


export const getRefreshToken = () => {
    return localStorage.getItem("refresh_token");
};


export const clearToken = () => {

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    localStorage.removeItem("user");
    localStorage.removeItem("roles");
    localStorage.removeItem("permissions");

};
/* ---------------- User ---------------- */

export const setUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

/* ---------------- Roles ---------------- */

export const setRoles = (roles) => {
    localStorage.setItem("roles", JSON.stringify(roles));
};

export const getRoles = () => {
    return JSON.parse(localStorage.getItem("roles") || "[]");
};

/* ---------------- Permissions ---------------- */

export const setPermissions = (permissions) => {
    localStorage.setItem(
        "permissions",
        JSON.stringify(permissions)
    );
};

export const getPermissions = () => {
    return JSON.parse(
        localStorage.getItem("permissions") || "[]"
    );
};

export const hasPermission = (permission) => {
    return getPermissions().includes(permission);
};