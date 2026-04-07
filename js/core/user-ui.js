import { getCurrentUser } from "./storage.js";

function getDefaultAvatar(name) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=4f46e5&color=fff`;
}

export function updateUserUI() {
    const user = getCurrentUser();
    if (!user) return;

    const avatarSrc = user.profileImage || user.image || getDefaultAvatar(user.name);
    const displayName = user.name || "User";

    // Primary shared selector requested for global avatar sync.
    document.querySelectorAll(".user-avatar").forEach((img) => {
        img.src = avatarSrc;
    });

    // Backward-compatible selectors used in existing pages.
    document.querySelectorAll(".avatar, .profile-trigger img, #profile-img").forEach((img) => {
        img.src = avatarSrc;
    });

    document.querySelectorAll(".user-name, #navUserName, #strongName").forEach((el) => {
        el.textContent = displayName;
    });

    const navName = document.querySelector(".profile-trigger span");
    if (navName) navName.textContent = displayName;
}
