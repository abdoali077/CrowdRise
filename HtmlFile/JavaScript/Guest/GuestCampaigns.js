document.addEventListener("DOMContentLoaded", () => {

    const campaignGrid = document.querySelector(".campaign-grid");
    const emptyState = document.querySelector(".empty-state");

    function getApprovedCampaigns() {
        const campaigns = JSON.parse(localStorage.getItem("campaigns")) || [];

        return campaigns.filter(c =>
            c.status && c.status.toLowerCase() === "approved"
        );
    }

    let campaigns = getApprovedCampaigns();
    let filteredCampaigns = [...campaigns];

    const searchInput = document.querySelector(".search-input input");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortSelect = document.getElementById("sortFilter");
    const resetBtn = document.querySelector(".btn-reset");

 
    let currentPage = 1;
    const itemsPerPage = 6;

    const prevBtn = document.querySelector(".pag-btn:first-child");
    const nextBtn = document.querySelector(".pag-btn:last-child");
    const pageNumbersContainer = document.querySelector(".pag-numbers");

  
    function renderCampaigns(data) {

        campaignGrid.innerHTML = "";

        if (data.length === 0) {
            emptyState.style.display = "block";
            return;
        } else {
            emptyState.style.display = "none";
        }

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        const paginatedData = data.slice(start, end);

        paginatedData.forEach(campaign => {

            const percent = campaign.goal
                ? Math.min((campaign.raised / campaign.goal) * 100, 100)
                : 0;

            const daysLeft = campaign.deadline
                ? Math.max(0, Math.ceil(
                    (new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24)
                ))
                : 0;

            const isClosed = daysLeft === 0;

            const card = document.createElement("article");
            card.classList.add("campaign-card");

            card.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="${campaign.image || 'https://via.placeholder.com/600'}" />
                    <span class="category-badge">${campaign.category || "General"}</span>
                </div>

                <div class="card-content">
                    <h3>${campaign.title || "No Title"}</h3>
                    <p class="card-description">${campaign.description || ""}</p>

                    <div class="funding-info">
                        <div class="funding-labels">
                            <span><strong>$${campaign.raised || 0}</strong> raised</span>
                            <span>${percent.toFixed(0)}%</span>
                        </div>

                        <div class="progress-bar">
                            <div class="progress-fill" style="width:${percent}%"></div>
                        </div>

                        <div class="goal-label">of $${campaign.goal || 0} goal</div>
                    </div>

                    <div class="card-stats">
                        <span><i class="fa-solid fa-user-group"></i> ${campaign.supporters || 0}</span>
                        <span><i class="fa-solid fa-clock"></i> ${daysLeft} Days Left</span>
                    </div>

                    <button class="btn-support" data-id="${campaign.id}">
                        ${isClosed 
                            ? "Campaign Closed" 
                            : '<i class="fa-solid fa-heart"></i> Support Campaign'}
                    </button>
                </div>
            `;

            campaignGrid.appendChild(card);
        });

        attachSupportEvents();
        renderPagination(data);
    }

   
    function attachSupportEvents() {

        document.querySelectorAll(".btn-support").forEach(btn => {

            btn.addEventListener("click", () => {

                const user = getCurrentUser();

                if (!user) {
                    alert("Please login first");
                    window.location.href = "login.html";
                    return;
                }

                if (btn.innerText.includes("Closed")) return;

                const campaignId = btn.dataset.id;

                localStorage.setItem("selectedCampaignId", campaignId);

                
                window.location.href = "User_Page/campaign-details.html";
            });
        });
    }

    
     //  PAGINATION
    
    function renderPagination(data) {
        const totalPages = Math.ceil(data.length / itemsPerPage);

        pageNumbersContainer.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
            const span = document.createElement("span");
            span.innerText = i;

            if (i === currentPage) span.classList.add("active");

            span.addEventListener("click", () => {
                currentPage = i;
                renderCampaigns(filteredCampaigns);
            });

            pageNumbersContainer.appendChild(span);
        }
    }

      // FILTERS
   
    function applyFilters() {
        let result = [...campaigns];

        const searchValue = searchInput?.value.toLowerCase();

        if (searchValue) {
            result = result.filter(c =>
                c.title.toLowerCase().includes(searchValue)
            );
        }

        if (categoryFilter?.value) {
            result = result.filter(c =>
                c.category?.toLowerCase() === categoryFilter.value.toLowerCase()
            );
        }

        if (sortSelect?.value === "deadline") {
            result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        } 
        else if (sortSelect?.value === "newest") {
            result.sort((a, b) => b.id - a.id);
        }

        filteredCampaigns = result;
        currentPage = 1;

        renderCampaigns(result);
    }

    searchInput?.addEventListener("input", applyFilters);
    categoryFilter?.addEventListener("change", applyFilters);
    sortSelect?.addEventListener("change", applyFilters);

    resetBtn?.addEventListener("click", () => {
        searchInput.value = "";
        categoryFilter.value = "";
        sortSelect.value = "newest";
        applyFilters();
    });

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

   
    applyFilters();
});