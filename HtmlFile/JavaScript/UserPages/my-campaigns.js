document.addEventListener("DOMContentLoaded", () => {

    const campaigns = getData("campaigns", []);
    const currentUser = getCurrentUser();

    const grid = document.querySelector(".campaign-grid");
    const createBtn = document.querySelector(".btn-create-new");
    const logoutBtn = document.querySelector(".logout-link");

    //  NAV 
    document.querySelector(".btn-nav-active").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "dashboard.html";
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "../home.html";
    });

    //  CREATE 
    createBtn.addEventListener("click", () => {

        if (!currentUser) {
            alert("Please login first");
            window.location.href = "login.html";
            return;
        }

        window.location.href = "create-campaign.html";
    });

    // RENDER
    function render() {

        grid.innerHTML = "";

        const userCampaigns = campaigns.filter(c => c.ownerId == currentUser?.id);

        if (userCampaigns.length === 0) {
            grid.innerHTML = "<p>No campaigns found</p>";
            return;
        }

        userCampaigns.forEach(campaign => {

            const percent = Math.min((campaign.raised / campaign.goal) * 100, 100);

            const daysLeft = Math.max(0, Math.ceil(
                (new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24)
            ));

            grid.innerHTML += `
                <article class="campaign-card" data-id="${campaign.id}">
                    <div class="card-image">
                        <img src="${campaign.image || '../../assets/img1.png'}">
                        <span class="category-badge">${campaign.category}</span>
                    </div>

                    <div class="card-body">
                        <h3>${campaign.title}</h3>
                        <p>${campaign.description}</p>

                        <div class="progress-bar">
                            <div class="progress-fill" style="width:${percent}%"></div>
                        </div>

                        <div class="card-stats">
                            <span>$${campaign.raised} / $${campaign.goal}</span>
                            <span>${daysLeft} Days Left</span>
                        </div>

                        <div class="card-actions">
                            <button class="action-btn view" data-id="${campaign.id}">
                                <i class="fa fa-eye"></i>
                            </button>

                            <button class="action-btn edit" data-id="${campaign.id}">
                                <i class="fa fa-pen"></i>
                            </button>

                            <button class="action-btn delete" data-id="${campaign.id}">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </article>
            `;
        });
    }

    //  EVENTS 
    grid.addEventListener("click", (e) => {

        const viewBtn = e.target.closest(".view");
        const editBtn = e.target.closest(".edit");
        const deleteBtn = e.target.closest(".delete");

        // VIEW
        if (viewBtn) {
            const id = viewBtn.dataset.id;

            localStorage.setItem("selectedCampaignId", id);

        
            window.location.href = "campaign-detail.html";
        }

        // EDIT 
        if (editBtn) {
            const id = editBtn.dataset.id;

            localStorage.setItem("editCampaignId", id);

            window.location.href = "edit-campaign.html";
        }

        // DELETE 
        if (deleteBtn) {
            const id = deleteBtn.dataset.id;

            if (!confirm("Are you sure you want to delete this campaign?")) return;

            let allCampaigns = getData("campaigns", []);

            const updated = allCampaigns.filter(c => c.id != id);

            localStorage.setItem("campaigns", JSON.stringify(updated));

            alert("Deleted successfully");

            render(); 
        }

    });

    render();

});