let logoutFn: (() => void) | null = null;

export const setLogoutHandler = (fn: () => void) => {
    logoutFn = fn;
};

export const logoutGlobal = () => {
    if (logoutFn) {
        logoutFn();
    } else {
        console.warn("Logout handler not set");
    }
};