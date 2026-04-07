import { updateUserUI } from "../core/user-ui.js";

export function initProfilePage() {
    let currentUser = getCurrentUser();
    if (!currentUser) {
        alert("Please login first");
        window.location.href = "../login.html";
        return;
    }

    const navLinks = document.querySelectorAll(".nav-links a");
    const logoutBtn = document.querySelector(".logout-btn");
    const profileName = document.querySelector(".profile-trigger span");
    const profileHeaderName = document.querySelector(".profile-header-card h2");
    const usernameEl = document.querySelector(".username");
    const joinDateEl = document.querySelector(".join-date");
    const bioEl = document.querySelector(".bio");
    const avatar = document.querySelector(".avatar-wrapper img");
    const navbarAvatar = document.querySelector(".profile-trigger img");
    const statsEls = document.querySelectorAll(".stat-card h3");
    const pledgeTotalEl = document.querySelector(".pledge-total h3");
    const profileForm = document.querySelector(".profile-form");
    const securityForm = document.querySelector(".security-form");
    const imgInput = document.getElementById("img-upload");

    const formInputs = profileForm ? profileForm.querySelectorAll("input") : [];
    const locationSelect = profileForm ? profileForm.querySelector("select") : null;
    const bioInput = profileForm ? profileForm.querySelector("textarea") : null;

    function formatJoinDate(user) {
        const raw = user.createdAt || user.joinDate || user.date;
        if (!raw) return "Unknown";
        const parsed = new Date(raw);
        if (Number.isNaN(parsed.getTime())) return raw;
        return parsed.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    }

    function persistUser(updatedUser) {
        let users = getData("users", []);
        users = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
        saveData("users", users);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        currentUser = updatedUser;
        updateUserUI();
    }

    function getAvatar(user) {
        return user.profileImage || user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=4f46e5&color=fff`;
    }

    function renderStats() {
        const campaigns = getData("campaigns", []);
        const pledges = getData("pledges", []);

        const createdCount = campaigns.filter((c) => c.ownerId == currentUser.id).length;
        const userPledges = pledges.filter((p) => p.userId == currentUser.id);
        const supportedCount = new Set(userPledges.map((p) => p.campaignId)).size;
        const totalPledged = userPledges.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

        if (statsEls[0]) statsEls[0].textContent = String(createdCount);
        if (statsEls[1]) statsEls[1].textContent = String(supportedCount);
        if (pledgeTotalEl) pledgeTotalEl.textContent = `$${totalPledged.toLocaleString()}`;
    }

    function renderProfile() {
        const fullName = currentUser.name || "Unknown";
        const username = currentUser.username || "user";
        const location = currentUser.location || currentUser.country || "Unknown";
        const avatarSrc = getAvatar(currentUser);

        if (profileName) profileName.textContent = fullName;
        if (profileHeaderName) profileHeaderName.textContent = fullName;
        if (usernameEl) usernameEl.textContent = `@${username}`;
        if (joinDateEl) joinDateEl.innerHTML = `<i class="fa-solid fa-calendar-days"></i> Joined ${formatJoinDate(currentUser)}`;
        if (bioEl) bioEl.textContent = currentUser.bio || location;
        if (avatar) avatar.src = avatarSrc;
        if (navbarAvatar) navbarAvatar.src = avatarSrc;

        if (profileForm && formInputs.length >= 5) {
            formInputs[0].value = fullName;
            formInputs[1].value = username;
            formInputs[2].value = currentUser.email || "";
            formInputs[3].value = currentUser.phone || "";
            formInputs[4].value = currentUser.website || "";
            if (locationSelect) locationSelect.value = location;
            if (bioInput) bioInput.value = currentUser.bio || "";
        }

        renderStats();
    }

    if (navLinks.length >= 3) {
        navLinks[0].addEventListener("click", (e) => { e.preventDefault(); window.location.href = "../../index.html"; });
        navLinks[1].addEventListener("click", (e) => { e.preventDefault(); window.location.href = "browse-campaigns.html"; });
        navLinks[2].addEventListener("click", (e) => { e.preventDefault(); window.location.href = "my-campaigns.html"; });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("currentUser");
            window.location.href = "../../index.html";
        });
    }

    if (profileForm) {
        profileForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const updatedUser = {
                ...currentUser,
                name: formInputs[0]?.value.trim() || "Unknown",
                username: formInputs[1]?.value.trim() || "user",
                email: formInputs[2]?.value.trim() || "",
                phone: formInputs[3]?.value.trim() || "",
                website: formInputs[4]?.value.trim() || "",
                location: locationSelect?.value || currentUser.location || "Unknown",
                country: locationSelect?.value || currentUser.country || "Unknown",
                bio: bioInput?.value.trim() || ""
            };
            persistUser(updatedUser);
            renderProfile();
            alert("Profile updated successfully");
        });
    }

    if (imgInput) {
        imgInput.addEventListener("change", () => {
            const file = imgInput.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                const updatedUser = {
                    ...currentUser,
                    profileImage: reader.result,
                    image: reader.result
                };
                persistUser(updatedUser);
                renderProfile();
            };
            reader.readAsDataURL(file);
        });
    }

    if (securityForm) {
        securityForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const inputs = securityForm.querySelectorAll("input");
            const currentPassword = inputs[0]?.value;
            const newPassword = inputs[1]?.value;
            const confirmPassword = inputs[2]?.value;

            if (!currentPassword || !newPassword || !confirmPassword) {
                alert("Please fill all fields ");
                return;
            }
            if (currentUser.password !== currentPassword) {
                alert(" Current password is incorrect");
                return;
            }
            if (newPassword !== confirmPassword) {
                alert(" New passwords do not match");
                return;
            }

            persistUser({ ...currentUser, password: newPassword });
            alert("Password updated successfully ");
            securityForm.reset();
        });
    }

    renderProfile();
}

