const loginBtn = document.getElementById("login-btn");

if (loginBtn) {
    loginBtn.onclick = () => {
        window.location.href = "login.html";
    };
}

const registerBtn = document.getElementById("register-btn");
if (registerBtn) {
    registerBtn.onclick = () => {
        window.location.href = "register.html";
    };
}

const exploreCampaign = document.getElementById("explore-campaign-btn");

if (exploreCampaign) {
    exploreCampaign.onclick = () => {
        const user = getCurrentUser();

        if (!user) {
            window.location.href = "campaigns.html";
            return;
        }

        window.location.href = "User_Page/browse-campaigns.html";
    };
}

const campaignsLink = document.getElementById("campaignsLink");

if (campaignsLink) {
    campaignsLink.addEventListener("click", (e) => {
        e.preventDefault();

        const user = getCurrentUser();

        if (!user) {
            window.location.href = "campaigns.html";
        } else {
            window.location.href = "User_Page/browse-campaigns.html";
        }
    });
}

//  START CAMPAIGN 
const startCampaignBtn = document.getElementById("start-campaign-btn");

if (startCampaignBtn) {
    startCampaignBtn.addEventListener("click", () => {
        const user = getCurrentUser();

        if (!user) {
            alert("Please login first");
            window.location.href = "login.html";
            return;
        }

        window.location.href = "User_Page/Dashboard.html";
    });
}

//  NAVBAR 
function updateNavbar() {
    const user = getCurrentUser();

    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");

    if (loginBtn && registerBtn) {
        if (user) {
            loginBtn.style.display = "none";
            registerBtn.style.display = "none";
        } else {
            loginBtn.style.display = "inline-block";
            registerBtn.style.display = "inline-block";
        }
    }
}

updateNavbar();

// CAMPAIGNS 
const campaignsContainer = document.getElementById("campaignsContainer");
const paginationContainer = document.getElementById("pagination");

const ITEMS_PER_PAGE = 4;
let currentPage = 1;

function getApprovedCampaigns() {
    const campaigns = JSON.parse(localStorage.getItem("campaigns")) || [];
    return campaigns.filter(c => c.status === "approved");
}

function displayCampaigns() {
    const campaigns = getApprovedCampaigns();

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    const paginatedItems = campaigns.slice(start, end);

    campaignsContainer.innerHTML = "";

    paginatedItems.forEach(campaign => {
        const card = document.createElement("div");
        card.classList.add("campaign-card");

        card.innerHTML = `
            <div class="campaign-image">
                <img src="${campaign.image || '../assets/default.png'}" alt="">
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

    const user = getCurrentUser();

    if (!user) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    const campaignId = btn.dataset.id;

    
    localStorage.setItem("selectedCampaignId", campaignId);

    alert("You supported the campaign 🎉");

    
    // window.location.href = "User_Page/campaign-detail.html";
});

//  PAGINATION 
function renderPagination(totalItems) {
    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.innerText = i;

        if (i === currentPage) {
            btn.classList.add("active");
        }

        btn.addEventListener("click", () => {
            currentPage = i;
            displayCampaigns();
        });

        paginationContainer.appendChild(btn);
    }
}

displayCampaigns();