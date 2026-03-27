document.addEventListener("DOMContentLoaded", () => {

    const campaigns = getData("campaigns", []);
    const grid = document.querySelector(".pledge-grid");
    const logoutBtn = document.querySelector(".btn-logout");
    const menuBtn = document.getElementById("mobile-menu-btn");
    const navLinks = document.getElementById("nav-links-container");

    // ================= NAVBAR =================

    // mobile menu
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("show");
    });

    // logout
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "../home.html";
    });

    // ================= RENDER =================
    function render() {

        const currentUser = getCurrentUser();
        const pledges = getData("pledges", []);

        grid.innerHTML = "";

        if (!currentUser) {
            grid.innerHTML = "<p>Please login first</p>";
            return;
        }

        const userPledges = pledges.filter(p => p.userId == currentUser.id);

        if (userPledges.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon"><i class="fa fa-folder-open"></i></div>
                    <h3 class="empty-title">No pledges yet</h3>
                    <p class="empty-subtitle">Start supporting campaigns الآن 🚀</p>
                </div>
            `;
            return;
        }

        userPledges.forEach(p => {

            const campaign = campaigns.find(c => c.id == p.campaignId) 
                || { title: "Deleted Campaign", image: "", raised: 0, goal: 1, status: "inactive" };

            const percent = campaign.goal ? Math.min((campaign.raised / campaign.goal) * 100, 100) : 0;
            const statusClass = campaign.status || "active";

            grid.innerHTML += `
                <div class="pledge-card" data-id="${campaign.id}">
                    <div class="card-image-wrapper">
                        <img src="${campaign.image || 'https://via.placeholder.com/600'}" class="card-image">
                        <span class="status-badge ${statusClass}">
                            ${campaign.status || "Active"}
                        </span>
                    </div>

                    <div class="card-body">
                        <h3 class="card-title">${campaign.title}</h3>
                        <p class="card-description">${campaign.description}</p>

                        <div class="pledge-info">
                            <span class="pledged-amount">$${p.amount} pledged</span>
                            <span class="pledge-date">${p.date}</span>
                            <span class="pledged-user">By: ${p.userName}</span>
                        </div>

                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width:${percent}%"></div>
                            </div>
                            <span class="progress-text">${Math.floor(percent)}% Funded</span>
                        </div>

                        <div class="card-actions">
                            <button class="btn-view-campaign" data-id="${campaign.id}">
                                View Campaign
                            </button>

                            ${
                                campaign.status === "active"
                                ? `<button class="btn-cancel-pledge" data-id="${p.id}">
                                    Cancel
                                   </button>`
                                : ""
                            }
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // ================= EVENTS =================
    grid.addEventListener("click", (e) => {

        const viewBtn = e.target.closest(".btn-view-campaign");
        const cancelBtn = e.target.closest(".btn-cancel-pledge");
        const card = e.target.closest(".pledge-card");

        // ===== VIEW =====
        if (viewBtn || (card && !cancelBtn)) {
            const id = (viewBtn?.dataset.id) || card.dataset.id;

            localStorage.setItem("selectedCampaignId", id);

            window.location.href = "../User_Page/campaign-detail.html";
        }

        // ===== CANCEL =====
        if (cancelBtn) {

            e.stopPropagation();

            const pledgeId = cancelBtn.dataset.id;

            if (!confirm("Cancel this pledge?")) return;

            let pledges = getData("pledges", []);
            let campaigns = getData("campaigns", []);

            const cancelledPledge = pledges.find(p => p.id == pledgeId);
            if (cancelledPledge) {
                // تحديث بيانات الحملة
                const campaign = campaigns.find(c => c.id == cancelledPledge.campaignId);
                if (campaign) {
                    campaign.raised -= cancelledPledge.amount;
                    campaign.supporters = Math.max((campaign.supporters || 1) - 1, 0);
                    localStorage.setItem("campaigns", JSON.stringify(campaigns));
                }
            }

           
            pledges = pledges.filter(p => p.id != pledgeId);
            localStorage.setItem("pledges", JSON.stringify(pledges));

            alert("Pledge cancelled");

            render();
        }
    });

    render();
});