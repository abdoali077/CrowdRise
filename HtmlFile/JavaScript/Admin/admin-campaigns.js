// Load Data
 
let campaigns = JSON.parse(localStorage.getItem("campaigns")) || [];


  // Admin Name

const adminText = document.querySelector(".admin-text .name");
const admin = JSON.parse(localStorage.getItem("currentUser"));

if (adminText && admin) {
    adminText.textContent = admin.name || "Admin";
}

//Elements
 
const campaignsGrid = document.getElementById("campaignsGrid");
const searchInput = document.getElementById("campaignSearch");
const filterBtns = document.querySelectorAll(".filter-btn");

let currentFilter = "all";


   //Render Campaigns
 
function renderCampaigns(data) {
    campaignsGrid.innerHTML = "";

    if (data.length === 0) {
        campaignsGrid.innerHTML = `<p>No campaigns found</p>`;
        return;
    }

    data.forEach(campaign => {
        const progress = Math.min(
            Math.floor((campaign.raised || 0) / (campaign.target || 1) * 100),
            100
        );

        const card = document.createElement("div");
        card.className = "campaign-card";

        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${campaign.image || 'https://via.placeholder.com/400'}">
                <span class="status-badge ${campaign.status || 'pending'}">
                    ${campaign.status || 'pending'}
                </span>
            </div>

            <div class="card-content">
                <span class="category-tag">${campaign.category || "General"}</span>
                <h3>${campaign.title}</h3>
                <p>By: ${campaign.creator || "Unknown"}</p>

                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width:${progress}%"></div>
                    </div>
                    <small>${progress}% funded</small>
                </div>
            </div>

            <div class="card-actions">
                <button class="action-btn btn-approve" data-id="${campaign.id}">
                    Approve
                </button>
                <button class="action-btn btn-reject" data-id="${campaign.id}">
                    Reject
                </button>
                <button class="action-btn btn-delete" data-id="${campaign.id}">
                    Delete
                </button>
            </div>
        `;

        campaignsGrid.appendChild(card);
    });
}

renderCampaigns(campaigns);

  // Search + Filter

searchInput.addEventListener("input", filterAndRender);

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".filter-btn.active")?.classList.remove("active");
        btn.classList.add("active");

        currentFilter = btn.dataset.status;
        filterAndRender();
    });
});

function filterAndRender() {
    const searchValue = searchInput.value.toLowerCase();

    let filtered = campaigns.filter(c => {
        const matchSearch =
            c.title.toLowerCase().includes(searchValue) ||
            (c.creator || "").toLowerCase().includes(searchValue);

        const matchFilter =
            currentFilter === "all" || (c.status || "pending") === currentFilter;

        return matchSearch && matchFilter;
    });

    renderCampaigns(filtered);
}


campaignsGrid.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = btn.dataset.id;
    const campaign = campaigns.find(c => c.id == id);
    if (!campaign) return;

    /* Approve */
    if (btn.classList.contains("btn-approve")) {
        campaign.status = "approved";
    }

    /* Reject */
    if (btn.classList.contains("btn-reject")) {
        campaign.status = "rejected";
    }

    /* Delete */
    if (btn.classList.contains("btn-delete")) {
        if (confirm("Delete this campaign?")) {
            campaigns = campaigns.filter(c => c.id != id);
        }
    }

    localStorage.setItem("campaigns", JSON.stringify(campaigns));
    filterAndRender();
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


const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("sidebar-overlay");
const toggleBtn = document.getElementById("toggle-sidebar");

toggleBtn?.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
});

overlay?.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
});