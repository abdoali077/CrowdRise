const campaignGrid = document.querySelector(".campaign-grid");

let campaigns = getData("campaigns", []);
let filteredCampaigns = [...campaigns];

// Filters
const searchInput = document.querySelector(".search-input input");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortFilter");
const resetBtn = document.querySelector(".btn-reset");

// Pagination
let currentPage = 1;
const itemsPerPage = 6;

const prevBtn = document.querySelector(".pag-btn:first-child");
const nextBtn = document.querySelector(".pag-btn:last-child");
const pageNumbersContainer = document.querySelector(".pag-numbers");

// ================= RENDER =================
function renderCampaigns(data) {
    if (!campaignGrid) return;

    campaignGrid.innerHTML = "";

    // 🔥 Pagination logic
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = data.slice(start, end);

    paginatedData.forEach(campaign => {
        const percent = Math.min((campaign.raised / campaign.goal) * 100, 100);

        const daysLeft = Math.max(0, Math.ceil(
            (new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24)
        ));

        campaignGrid.innerHTML += `
            <article class="campaign-card">
                <div class="card-image-wrapper">
                    <img src="${campaign.image || 'https://via.placeholder.com/600'}" />
                    <span class="category-badge">${campaign.category}</span>
                </div>

                <div class="card-content">
                    <h3>${campaign.title}</h3>
                    <p class="card-description">${campaign.description}</p>

                    <div class="funding-info">
                        <div class="funding-labels">
                            <span><strong>$${campaign.raised}</strong> raised</span>
                            <span>${percent.toFixed(0)}%</span>
                        </div>

                        <div class="progress-bar">
                            <div class="progress-fill" style="width:${percent}%"></div>
                        </div>

                        <div class="goal-label">of $${campaign.goal} goal</div>
                    </div>

                    <div class="card-stats">
                        <span><i class="fa-solid fa-user-group"></i> ${campaign.supporters || 0}</span>
                        <span><i class="fa-solid fa-clock"></i> ${daysLeft} Days Left</span>
                    </div>

                    <button class="btn-support guest-btn">
                        <i class="fa-solid fa-lock"></i> Login to Support
                    </button>
                </div>
            </article>
        `;
    });

    renderPagination(data);
}

// ================= PAGINATION UI =================
function renderPagination(data) {
    const totalPages = Math.ceil(data.length / itemsPerPage);

    pageNumbersContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        pageNumbersContainer.innerHTML += `
            <span class="${i === currentPage ? "active" : ""}" data-page="${i}">
                ${i}
            </span>
        `;
    }
}

// ================= FILTER =================
function applyFilters() {
    let result = [...campaigns];

    const searchValue = searchInput ? searchInput.value.toLowerCase() : "";

    // Search
    if (searchValue) {
        result = result.filter(c =>
            c.title.toLowerCase().includes(searchValue)
        );
    }

    // Category
    if (categoryFilter && categoryFilter.value) {
        result = result.filter(c =>
            c.category === categoryFilter.value
        );
    }

    // Sort
    if (sortSelect && sortSelect.value === "deadline") {
        result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (sortSelect && sortSelect.value === "newest") {
        result.sort((a, b) => b.id - a.id);
    }

    filteredCampaigns = result;
    currentPage = 1; // 🔥 reset page

    renderCampaigns(result);
}

// ================= EVENTS =================
if (searchInput) searchInput.addEventListener("input", applyFilters);
if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);
if (sortSelect) sortSelect.addEventListener("change", applyFilters);

if (resetBtn) {
    resetBtn.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        if (categoryFilter) categoryFilter.value = "";
        if (sortSelect) sortSelect.value = "newest";

        applyFilters();
    });
}

// 🔥 Pagination Buttons
prevBtn?.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderCampaigns(filteredCampaigns);
    }
});

nextBtn?.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        renderCampaigns(filteredCampaigns);
    }
});

// 🔥 Click on page number
pageNumbersContainer?.addEventListener("click", (e) => {
    if (e.target.dataset.page) {
        currentPage = Number(e.target.dataset.page);
        renderCampaigns(filteredCampaigns);
    }
});

// ================= GUEST SUPPORT =================
campaignGrid?.addEventListener("click", function (e) {
    const btn = e.target.closest(".guest-btn");
    if (!btn) return;

    alert("🔒 You must login to support a campaign!");
    window.location.href = "login.html";
});

// ================= INIT =================
applyFilters();