document.addEventListener("DOMContentLoaded", () => {

    function updateUser(updatedUser) {
        let users = getData("users", []);

        users = users.map(user =>
            user.id === updatedUser.id ? updatedUser : user
        );

        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }

    const currentUser = getCurrentUser();

    if (!currentUser) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    const navLinks = document.querySelectorAll(".nav-links a");
    const logoutBtn = document.querySelector(".logout-btn");
    const profileName = document.querySelector(".profile-trigger span");

    // ================= NAVBAR =================

    navLinks[0].addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "../home.html";
    });

    navLinks[1].addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "browse-campaigns.html";
    });

    navLinks[2].addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "my-campaigns.html";
    });

    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("currentUser");
        window.location.href = "../home.html";
    });

    // ================= USER INFO =================

    profileName.textContent = currentUser.name;

    document.querySelector(".profile-header-card h2").textContent = currentUser.name;
    document.querySelector(".username").textContent = `@${currentUser.username || "user"}`;

    document.querySelector(".join-date").innerHTML =
        `<i class="fa-solid fa-calendar-days"></i> Joined ${currentUser.joinDate || "Unknown"}`;

    document.querySelector(".bio").textContent = currentUser.bio || "";

    const avatar = document.querySelector(".avatar-wrapper img");
    const navbarAvatar = document.querySelector(".profile-trigger img");

    const imageUrl = currentUser.image ||
        `https://ui-avatars.com/api/?name=${currentUser.name}&background=4f46e5&color=fff`;

    avatar.src = imageUrl;
    navbarAvatar.src = imageUrl;

    // ================= STATS =================

    const campaigns = getData("campaigns", []);
    const userCampaigns = campaigns.filter(c => c.ownerId == currentUser.id);

    const createdCount = userCampaigns.length;
    const supportedCount = currentUser.supported?.length || 12;

    let totalPledged = 0;

    userCampaigns.forEach(c => {
        totalPledged += c.raised || 0;
    });

    document.querySelectorAll(".stat-card h3")[0].textContent =
        String(createdCount).padStart(2, "0");

    document.querySelectorAll(".stat-card h3")[1].textContent =
        String(supportedCount).padStart(2, "0");

    document.querySelector(".pledge-total h3").textContent =
        `$${totalPledged.toLocaleString()}`;

    // ================= EDIT PROFILE =================

    const form = document.querySelector(".profile-form");

    form.querySelectorAll("input")[0].value = currentUser.name || "";
    form.querySelectorAll("input")[1].value = currentUser.username || "";
    form.querySelectorAll("input")[2].value = currentUser.email || "";
    form.querySelectorAll("input")[3].value = currentUser.phone || "";

    form.querySelector("textarea").value = currentUser.bio || "";

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const updatedUser = {
            ...currentUser,
            name: form.querySelectorAll("input")[0].value,
            username: form.querySelectorAll("input")[1].value,
            email: form.querySelectorAll("input")[2].value,
            phone: form.querySelectorAll("input")[3].value,
            bio: form.querySelector("textarea").value
        };

        updateUser(updatedUser); // ✅ أهم سطر

        alert("Profile updated successfully");

        location.reload();
    });

    // ================= IMAGE UPLOAD =================

    const imgInput = document.getElementById("img-upload");

    imgInput.addEventListener("change", () => {
        const file = imgInput.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {

            const updatedUser = {
                ...currentUser,
                image: reader.result
            };

            updateUser(updatedUser); // ✅ مهم

            avatar.src = reader.result;
            navbarAvatar.src = reader.result;
        };

        reader.readAsDataURL(file);
    });

});


// ================= SECURITY =================

document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector(".security-form");

    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let currentUser = getCurrentUser();

        const inputs = form.querySelectorAll("input");

        const currentPassword = inputs[0].value;
        const newPassword = inputs[1].value;
        const confirmPassword = inputs[2].value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("Please fill all fields ❌");
            return;
        }

        if (currentUser.password !== currentPassword) {
            alert("❌ Current password is incorrect");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("❌ New passwords do not match");
            return;
        }

        const updatedUser = {
            ...currentUser,
            password: newPassword
        };

        let users = getData("users", []);

        users = users.map(user =>
            user.id === currentUser.id ? updatedUser : user
        );

        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));

        alert("Password updated successfully ✅");

        form.reset();
    });

});