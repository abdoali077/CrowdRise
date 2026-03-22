//aside
document.addEventListener("DOMContentLoaded", () => {

    const routes = {
        dashboard: "Dashboard.html",
        browse: "browse-campaigns.html",
        "my-campaigns": "my-campaigns.html",
        history: "pledge-history.html",
        settings: "Profile.html",
        logout: "logout"
    };

    document.querySelectorAll(".nav-item").forEach(item => {
        item.addEventListener("click", () => {

            const page = item.getAttribute("data-page");

            const target = routes[page];

            if (!target) return;

            if (target === "logout") {
                logout();
                window.location.href = "../Home.html";
            } else {
                window.location.href = target;
            }
        });
    });

});


//----------------------------------

const user=getCurrentUser();
if(user){
    document.getElementById("welcomeText").textContent=  `Welcome back, ${user.name} 👋`;
//     document.getElementById("supportText").textContent=
//     `You have supported ${userSupports.length} campaigns this month.`
 }
else{
    document.getElementById("welcomeText").textContent = 
        "Welcome 👋";

    document.getElementById("supportText").textContent = 
        "Please login to start supporting campaigns.";
}

///======================
const userBtn = getCurrentUser();
const btnCreate = document.querySelector(".btn-create");

btnCreate.addEventListener("click", () => {

    if (!userBtn) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    window.location.href = "create-campaign.html";
});
//===============
const currentUser = getCurrentUser();

if (currentUser) {
   
    document.getElementById("navUserName").textContent = currentUser.name;
    document.getElementById("strongName").textContent=currentUser.name;
    document.getElementById("userEmail").textContent=currentUser.email;

    const avatar = document.querySelector(".user-avatar");
    avatar.src = `https://ui-avatars.com/api/?name=${currentUser.name}&background=4f46e5&color=fff`;
}

const userLogout=document.getElementById("logoutProfile");
userLogout.addEventListener("click",function(e){
    e.preventDefault();
    if(currentUser){
        logout();
        window.location.href = "../home.html";
    }
})

// Search Navbar

const navSearch = document.getElementById("navSearch");

navSearch.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {

        const value = navSearch.value.trim();

        if (!value) return;

        localStorage.setItem("searchQuery", value);

        window.location.href = "browse-campaigns.html";
    }
});


// show campaigns
const campaignsGrid = document.querySelector(".campaigns-grid");

function getUserCampaigns() {
    const currentUser = getCurrentUser();

    if (!currentUser) return [];

    const campaigns = getData("campaigns", []);

    return campaigns.filter(c => c.ownerId == currentUser.id);
}

function renderUserCampaigns() {

    const currentUser = getCurrentUser();

    campaignsGrid.innerHTML = "";

    if (!currentUser) {
        campaignsGrid.innerHTML = `<p>Please login first</p>`;
        return;
    }

    const userCampaigns = getUserCampaigns();

    if (userCampaigns.length === 0) {
        campaignsGrid.innerHTML = `<p>No campaigns yet</p>`;
        return;
    }

    userCampaigns.slice(0, 3).forEach(campaign => {

        const percent = Math.min((campaign.raised / campaign.goal) * 100, 100);

        const daysLeft = Math.max(0, Math.ceil(
            (new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24)
        ));

        campaignsGrid.innerHTML += `
            <div class="campaign-card">
                <div class="card-img">
                    <img src="${campaign.image || '../../assets/img1.png'}">
                    <span class="card-category">${campaign.category}</span>
                </div>

                <div class="card-content">
                    <h3>${campaign.title}</h3>
                    <p class="card-desc">${campaign.description}</p>

                    <div class="card-stats">
                        <div class="c-stat">
                            <strong>$${campaign.raised}</strong>
                            <span>Raised</span>
                        </div>

                        <div class="c-stat">
                            <strong>${campaign.supporters || 0}</strong>
                            <span>Supporters</span>
                        </div>

                        <div class="c-stat">
                            <strong>${daysLeft}</strong>
                            <span>Days Left</span>
                        </div>
                    </div>

                    <div class="card-progress-bar">
                        <div class="progress" style="width:${percent}%"></div>
                    </div>

                    <div class="card-footer">
                        <span class="percent">${percent.toFixed(0)}% Funded</span>
                        <button class="edit-btn" data-id="${campaign.id}">
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

// ================== INIT ==================
renderUserCampaigns();

//----------------
campaignsGrid.addEventListener("click", function (e) {

    const editBtn = e.target.closest(".edit-btn");

    if (!editBtn) return;

    const campaignId = editBtn.dataset.id;

    
    localStorage.setItem("editCampaignId", campaignId);
    //saveData("editCampaignId", campaignId);
    window.location.href = "edit-campaign.html";
});