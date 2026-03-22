const loginBtn = document.getElementById("login-btn");

if (loginBtn) {
    loginBtn.onclick = () => {
        window.location.href = "login.html";
    };
}
const registerBtn=document.getElementById("register-btn");
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
        // window.location.href = "campaigns.html";
   
}
 const campaignsLink = document.getElementById("campaignsLink");

    campaignsLink.addEventListener("click", (e) => {
        e.preventDefault();

        const user = getCurrentUser();

        if (!user) {
           
            window.location.href = "campaigns.html"; 
        
        } else {
           
            window.location.href = "User_Page/browse-campaigns.html";
        }
    });

// start campaigns

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

// Navbar UI
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

// Support buttons
document.querySelectorAll(".support-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const user = getCurrentUser();

        if (!user) {
            alert("Please login first");
            window.location.href = "login.html";
            return;
        }

        alert("You supported the campaign");
    });
});