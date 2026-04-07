document.addEventListener("DOMContentLoaded", () => {

    const currentUser = getCurrentUser() || JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || currentUser.role !== "admin") {
        alert("Access denied");
        window.location.href = "../login.html";
        return;
    }

    const updateNavbar = () => {
        const adminNameEl = document.querySelector(".admin-text .name");
        const adminImgEl = document.querySelector(".admin-profile img");

        if (adminNameEl) adminNameEl.textContent = currentUser.name || "Admin Root";

        if (adminImgEl) {
            adminImgEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=4f46e5&color=fff`;
        }
    };

    const toggleBtn = document.getElementById("toggle-sidebar");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");

    const toggleSidebar = () => {
        sidebar?.classList.toggle("active");
    };

    if (toggleBtn) toggleBtn.addEventListener("click", toggleSidebar);
    if (overlay) overlay.addEventListener("click", toggleSidebar);

    function loadDashboard() {

        const users = typeof getData === 'function' ? getData("users") : JSON.parse(localStorage.getItem("users")) || [];
        const campaigns = typeof getData === 'function' ? getData("campaigns") : JSON.parse(localStorage.getItem("campaigns")) || [];
        const pledges = typeof getData === 'function' ? getData("pledges") : JSON.parse(localStorage.getItem("pledges")) || [];

        const totalUsersEl = document.querySelector(".stat-card:nth-child(1) h3");
        const totalCampaignsEl = document.querySelector(".stat-card:nth-child(2) h3");
        const totalPledgesEl = document.querySelector(".stat-card:nth-child(3) h3");
        const pendingCampaignsEl = document.querySelector(".stat-card:nth-child(4) h3");

        if (totalUsersEl) totalUsersEl.textContent = users.length.toLocaleString();
        if (totalCampaignsEl) totalCampaignsEl.textContent = campaigns.length.toLocaleString();

        const totalPledgesAmt = pledges.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        if (totalPledgesEl) totalPledgesEl.textContent = `$${totalPledgesAmt.toLocaleString()}`;

        const pendingCount = campaigns.filter(c => c.status === "pending").length;
        if (pendingCampaignsEl) pendingCampaignsEl.textContent = pendingCount;

        const usersTableBody = document.querySelector(".card:nth-child(1) tbody");
        if (usersTableBody) {
            usersTableBody.innerHTML = users.slice(-5).reverse().map(user => `
                <tr>
                    <td>
                        <div class="user-td">
                            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random">
                            <span>${user.name}</span>
                        </div>
                    </td>
                    <td>
                        <span class="badge ${user.status === "banned" ? "banned" : "active"}">
    ${user.status === "banned" ? "Banned" : "Active"}
</span>
                    </td>
                </tr>
            `).join('');
        }

        const campaignsTableBody = document.querySelector(".card:nth-child(2) tbody");
        if (campaignsTableBody) {
            campaignsTableBody.innerHTML = campaigns.slice(-5).reverse().map(c => `
                <tr>
                    <td><strong>${c.title}</strong></td>
                    <td>
                        <span class="badge ${(c.status || 'pending').toLowerCase()}">
                            ${c.status || 'Pending'}
                        </span>
                    </td>
                </tr>
            `).join('');
        }
    }

    const searchInput = document.querySelector(".search-wrapper input");

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            const rows = document.querySelectorAll(".data-grid tbody tr");

            rows.forEach(row => {
                const text = row.innerText.toLowerCase();
                row.style.display = text.includes(query) ? "" : "none";
            });
        });
    }

    const logoutBtn = document.querySelector(".logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            if (typeof logout === 'function') {
                logout();
            } else {
                localStorage.removeItem("currentUser");
            }

            window.location.href = "../login.html";
        });
    }

    updateNavbar();
    loadDashboard();
});


// Navigation buttons

const usersBtn = document.getElementById("users-Btn");
const campaignBtn = document.getElementById("campaign-Btn");

if (usersBtn) {
    usersBtn.addEventListener("click", () => {
        window.location.href = "users-management.html";
    });
}

if (campaignBtn) {
    campaignBtn.addEventListener("click", () => {
        window.location.href = "admin-campaigns.html";
    });
}


document.addEventListener("DOMContentLoaded", () => {

    const viewAllUsersBtn = document.getElementById("view-all-users");
    const viewAllCampaignsBtn = document.getElementById("view-all-campaigns");

    if (viewAllUsersBtn) {
        viewAllUsersBtn.addEventListener("click", () => {
            window.location.href = "users-management.html";
        });
    }

    if (viewAllCampaignsBtn) {
        viewAllCampaignsBtn.addEventListener("click", () => {
            window.location.href = "admin-campaigns.html";
        });
    }


});

document.querySelectorAll(".sidebar-nav li").forEach(item => {
    item.addEventListener("click", () => {
        const text = item.innerText.toLowerCase();

        if (text.includes("overview")) {
            window.location.href = "admin-dashboard.html";
        } else if (text.includes("users")) {
            window.location.href = "users-management.html";
        } else if (text.includes("campaigns")) {
            window.location.href = "admin-campaigns.html";
        } else if (text.includes("pledges")) {
            window.location.href = "admin-pledges.html";
        } else if (text.includes("settings")) {
            window.location.href = "admin-settings.html";
        }
    });
});

