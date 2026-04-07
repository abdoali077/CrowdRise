export function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

export function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    return data;
}

export function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

export function login(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
}

export function logout() {
    localStorage.removeItem("currentUser");
}
