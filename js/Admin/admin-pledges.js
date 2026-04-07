document.addEventListener("DOMContentLoaded", () => {

    const admin = JSON.parse(localStorage.getItem("currentUser"));
    const adminNameEl = document.querySelector(".admin-text .name");
    if (admin && adminNameEl) adminNameEl.textContent = admin.name || "Admin Root";

    const adminImg = document.querySelector(".admin-profile img");
    if (adminImg && admin) adminImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name)}&background=4f46e5&color=fff`;

    // Sidebar Toggle
    const toggleBtn = document.getElementById("toggle-sidebar");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    const toggleSidebar = () => sidebar.classList.toggle("active");
    if (toggleBtn) toggleBtn.addEventListener("click", toggleSidebar);
    if (overlay) overlay.addEventListener("click", toggleSidebar);

    // Data
    let pledges = JSON.parse(localStorage.getItem("pledges")) || [];
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let campaigns = JSON.parse(localStorage.getItem("campaigns")) || [];

    // Helpers
    const getUserName = (userId) => {
        const user = users.find(u => u.id == userId);
        return user ? user.name : "Unknown";
    };
    const getCampaignTitle = (campaignId) => {
        const camp = campaigns.find(c => c.id == campaignId);
        return camp ? camp.title : "Unknown";
    };

    // Total Amount
    function updateTotalAmount(data) {
        const total = data.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        const totalEl = document.getElementById("totalAmount");
        if (totalEl) totalEl.textContent = `$${total.toLocaleString()}`;
    }

    // Render Table
    const tableBody = document.getElementById("pledgesTableBody");

    function renderTable(data) {
        tableBody.innerHTML = "";

        data.forEach(p => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td data-label="Pledge ID">#${p.id}</td>
                <td data-label="User Name">${getUserName(p.userId)}</td>
                <td data-label="Campaign Title">${getCampaignTitle(p.campaignId)}</td>
                <td data-label="Amount" class="amount-cell">$${Number(p.amount).toLocaleString()}</td>
                <td data-label="Date">${p.date || "N/A"}</td>
                <td data-label="Status">
                    <span class="status-badge">Completed</span>
                </td>
            `;

            tableBody.appendChild(tr);
        });

        updateTotalAmount(data);
    }

    renderTable(pledges);

    // Search & Filters
    const searchInput = document.getElementById("pledgeSearch");
    const sortSelect = document.getElementById("sortPledges");
    const campaignFilter = document.getElementById("campaignFilter");

    campaigns.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = c.title;
        campaignFilter.appendChild(option);
    });

    function applyFilters() {
        let filtered = [...pledges];

        const searchValue = searchInput.value.toLowerCase();
        const sortValue = sortSelect.value;
        const campaignValue = campaignFilter.value;

        if (searchValue) {
            filtered = filtered.filter(p => {
                const userName = getUserName(p.userId).toLowerCase();
                const campaignTitle = getCampaignTitle(p.campaignId).toLowerCase();
                return userName.includes(searchValue) || campaignTitle.includes(searchValue);
            });
        }

        if (campaignValue !== "all") filtered = filtered.filter(p => p.campaignId == campaignValue);

        if (sortValue === "newest") filtered.sort((a,b) => new Date(b.date) - new Date(a.date));
        if (sortValue === "oldest") filtered.sort((a,b) => new Date(a.date) - new Date(b.date));
        if (sortValue === "amount-high") filtered.sort((a,b) => b.amount - a.amount);
        if (sortValue === "amount-low") filtered.sort((a,b) => a.amount - b.amount);

        renderTable(filtered);
    }

    searchInput.addEventListener("input", applyFilters);
    sortSelect.addEventListener("change", applyFilters);
    campaignFilter.addEventListener("change", applyFilters);

    // Logout
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "../login.html";
    });

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
            window.location.href = "settings.html";
        }
    });
});


