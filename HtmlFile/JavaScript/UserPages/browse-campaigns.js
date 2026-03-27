const campaignGrid = document.getElementById("campaignGrid");

function getApprovedCampaigns() {
    return getData("campaigns", [])
        .filter(c => c.status && c.status.toLowerCase() === "approved");
}

let campaigns = [];
let filteredCampaigns = [];

// FILTER ELEMENTS 
const searchInput = document.querySelector(".search-box input");
const categoryFilter = document.querySelectorAll(".filter-select")[0];
const sortSelect = document.querySelectorAll(".filter-select")[1];
const resetBtn = document.querySelector(".btn-reset");

// PAGINATION 
let currentPage = 1;
const itemsPerPage = 6;

const prevBtn = document.querySelector(".page-link:first-child");
const nextBtn = document.querySelector(".page-link:last-child");
const pageNumbersContainer = document.querySelector(".page-numbers");

// RENDER 
function renderCampaigns(data) {
    campaignGrid.innerHTML = "";

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
                <div class="card-img-wrapper">
                    <img src="${campaign.image || 'https://via.placeholder.com/600'}" />
                    <span class="badge">${campaign.category}</span>
                </div>

                <div class="card-content">
                    <h3>${campaign.title}</h3>
                    <p class="card-desc">${campaign.description}</p>

                    <div class="funding-labels">
                        <span><strong>$${campaign.raised}</strong> raised</span>
                        <span class="percent">${percent.toFixed(0)}%</span>
                    </div>

                    <div class="progress-bar">
                        <div class="progress-fill" style="width:${percent}%"></div>
                    </div>

                    <span class="goal-target">of $${campaign.goal} goal</span>

                    <div class="card-stats">
                        <span><i class="fa-solid fa-users"></i> ${campaign.supporters || 0}</span>
                        <span><i class="fa-solid fa-clock"></i> ${daysLeft} Days Left</span>
                    </div>

                    <button class="btn-support" data-id="${campaign.id}">
                        <i class="fa-solid fa-bolt"></i> Support Campaign
                    </button>
                </div>
            </article>
        `;
    });

    renderPagination(data);
}

// PAGINATION RENDER 
function renderPagination(data) {
    const totalPages = Math.ceil(data.length / itemsPerPage);

    pageNumbersContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        pageNumbersContainer.innerHTML += `
            <span class="page-num ${i === currentPage ? "active" : ""}" data-page="${i}">
                ${i}
            </span>
        `;
    }
}

// FILTER 
function applyFilters() {
    campaigns = getApprovedCampaigns(); 

    let result = [...campaigns];

    const searchValue = searchInput.value.toLowerCase();

    if (searchValue) {
        result = result.filter(c =>
            c.title.toLowerCase().includes(searchValue)
        );
    }

    if (categoryFilter.value) {
        result = result.filter(c =>
            c.category === categoryFilter.value
        );
    }

    if (sortSelect.value === "deadline") {
        result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (sortSelect.value === "newest") {
        result.sort((a, b) => b.id - a.id);
    }

    filteredCampaigns = result;
    currentPage = 1;

    renderCampaigns(result);
}

// EVENTS 
searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);

resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "";
    sortSelect.value = "newest";

    applyFilters();
});

// PAGINATION BUTTONS 
prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderCampaigns(filteredCampaigns);
    }
});

nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        renderCampaigns(filteredCampaigns);
    }
});

// CLICK PAGE NUMBER 
pageNumbersContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("page-num")) {
        currentPage = Number(e.target.dataset.page);
        renderCampaigns(filteredCampaigns);
    }
});

// LOGOUT
const logoutText = document.getElementById("logouttext");

if (logoutText) {
    logoutText.addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.removeItem("currentUser");
        window.location.href = "../home.html";
    });
}

// SEARCH MEMORY 
const savedSearch = localStorage.getItem("searchQuery");

if (savedSearch) {
    searchInput.value = savedSearch;
    localStorage.removeItem("searchQuery");
}

applyFilters();

// USER INFO 
document.addEventListener("DOMContentLoaded", () => {
    const currentUser = getCurrentUser();
    const usernameElement = document.querySelector(".username");

    if (!currentUser) {
        usernameElement.textContent = "Guest";
    } else {
        usernameElement.textContent = currentUser.name;
    }

    const welcomeText = document.getElementById("welcomeText");

    if (currentUser && welcomeText) {
        welcomeText.textContent = `Welcome back, ${currentUser.name}! Discover innovative ideas and support creators around the world.`;
    }
});

// SUPPORT / PLEDGE
campaignGrid.addEventListener("click", (e) => {
    const supportBtn = e.target.closest(".btn-support");
    if (!supportBtn) return;

    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert("Please login first");
        return;
    }

    const campaignId = supportBtn.dataset.id; 

    let campaigns = getData("campaigns", []);
    let pledges = getData("pledges", []);

    const campaign = campaigns.find(c => c.id == campaignId);
    if (!campaign) return;

    // منع التكرار
    const alreadyPledged = pledges.find(p =>
        p.userId == currentUser.id && p.campaignId == campaign.id
    );
    if (alreadyPledged) {
        alert("You already supported this campaign");
        return;
    }

    const amount = prompt("Enter pledge amount:");
    if (!amount || isNaN(amount) || amount <= 0) {
        alert("Invalid amount");
        return;
    }

    // ✅ تخزين بيانات كاملة للـ admin
    const pledge = {
        id: Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,          
        campaignId: campaign.id,
        campaignTitle: campaign.title,      
        amount: Number(amount),
        date: new Date().toLocaleDateString()
    };

    pledges.push(pledge);

    // تحديث بيانات الحملة
    campaign.raised += Number(amount);
    campaign.supporters = (campaign.supporters || 0) + 1;

    localStorage.setItem("pledges", JSON.stringify(pledges));
    localStorage.setItem("campaigns", JSON.stringify(campaigns));

    alert("Pledge successful 🎉");

    // تحديث الكروت
    applyFilters();
});