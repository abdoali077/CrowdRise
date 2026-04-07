import { getCurrentUser } from "./storage.js";

export function initHomePage() {
    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
        loginBtn.onclick = () => {
            window.location.href = "./pages/login.html";
        };
    }

    const registerBtn = document.getElementById("register-btn");
    if (registerBtn) {
        registerBtn.onclick = () => {
            window.location.href = "./pages/register.html";
        };
    }

    const exploreCampaign = document.getElementById("explore-campaign-btn");
    if (exploreCampaign) {
        exploreCampaign.onclick = () => {
            const user = getCurrentUser();
            if (!user) {
                window.location.href = "./pages/campaigns.html";
                return;
            }
            window.location.href = "./pages/User_Page/browse-campaigns.html";
        };
    }

    const campaignsLink = document.getElementById("campaignsLink");
    if (campaignsLink) {
        campaignsLink.addEventListener("click", (e) => {
            e.preventDefault();
            const user = getCurrentUser();
            window.location.href = user ? "./pages/User_Page/browse-campaigns.html" : "./pages/campaigns.html";
        });
    }

    const startCampaignBtn = document.getElementById("start-campaign-btn");
    if (startCampaignBtn) {
        startCampaignBtn.addEventListener("click", () => {
            const user = getCurrentUser();
            if (!user) {
                alert("Please login first");
                window.location.href = "./pages/login.html";
                return;
            }
            window.location.href = "./pages/User_Page/Dashboard.html";
        });
    }

    const loginBtnEl = document.getElementById("login-btn");
    const registerBtnEl = document.getElementById("register-btn");
    const user = getCurrentUser();
    if (loginBtnEl && registerBtnEl) {
        loginBtnEl.style.display = user ? "none" : "inline-block";
        registerBtnEl.style.display = user ? "none" : "inline-block";
    }

    const campaignsContainer = document.getElementById("campaignsContainer");
    const paginationContainer = document.getElementById("pagination");
    if (!campaignsContainer || !paginationContainer) return;

    const ITEMS_PER_PAGE = 4;
    let currentPage = 1;

    function getApprovedCampaigns() {
        const campaigns = JSON.parse(localStorage.getItem("campaigns")) || [];
        return campaigns.filter((c) => c.status === "approved");
    }

    function renderPagination(totalItems) {
        paginationContainer.innerHTML = "";
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.innerText = i;
            if (i === currentPage) btn.classList.add("active");
            btn.addEventListener("click", () => {
                currentPage = i;
                displayCampaigns();
            });
            paginationContainer.appendChild(btn);
        }
    }

    function displayCampaigns() {
        const campaigns = getApprovedCampaigns();
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const paginatedItems = campaigns.slice(start, end);

        campaignsContainer.innerHTML = "";
        paginatedItems.forEach((campaign) => {
            const card = document.createElement("div");
            card.classList.add("campaign-card");
            card.innerHTML = `
                <div class="campaign-image">
                    <img src="${campaign.image || "./images/default.png"}" alt="">
                </div>
                <h3>${campaign.title}</h3>
                <p>${campaign.description}</p>
                <button class="support-btn" data-id="${campaign.id}">
                    Support
                </button>
            `;
            campaignsContainer.appendChild(card);
        });
        renderPagination(campaigns.length);
    }

    campaignsContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".support-btn");
        if (!btn) return;
        const currentUser = getCurrentUser();
        if (!currentUser) {
            alert("Please login first");
            window.location.href = "./pages/login.html";
            return;
        }
        localStorage.setItem("selectedCampaignId", btn.dataset.id);
        alert("You supported the campaign ðŸŽ‰");
    });

    displayCampaigns();
}
