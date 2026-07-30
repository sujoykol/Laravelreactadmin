export const getPermissions = () => {
    return JSON.parse(
        localStorage.getItem("permissions") || "[]"
    );
};


export const hasPermission = (permission) => {
    const permissions = getPermissions();

    return permissions.includes(permission);
};