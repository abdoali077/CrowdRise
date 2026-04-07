import { getData, saveData, getCurrentUser, login, logout } from "./core/storage.js";
import { initializeLocalStorage } from "./core/init.js";
import { initAuthForms } from "./core/auth.js";
import { initHomePage } from "./core/home.js";
import { updateUserUI } from "./core/user-ui.js";

window.getData = getData;
window.saveData = saveData;
window.getCurrentUser = getCurrentUser;
window.login = login;
window.logout = logout;

initializeLocalStorage();
initAuthForms();
initHomePage();
updateUserUI();

window.addEventListener("storage", (event) => {
    if (event.key === "currentUser" || event.key === "users") {
        updateUserUI();
    }
});

const scriptMap = {
    "/pages/campaigns.html": "./Guest/GuestCampaigns.js",
    "/pages/campaign-details.html": "./Guest/Guestcampaign-details.js",
    "/pages/user_page/dashboard.html": "./UserPages/Dashboard.js",
    "/pages/user_page/browse-campaigns.html": "./UserPages/browse-campaigns.js",
    "/pages/user_page/create-campaign.html": "./UserPages/CreateCampaigns.js",
    "/pages/user_page/edit-campaign.html": "./UserPages/edite-campaign.js",
    "/pages/user_page/my-campaigns.html": "./UserPages/my-campaigns.js",
    "/pages/user_page/pledge-history.html": "./UserPages/pledge-history.js",
    "/pages/user_page/profile.html": "./UserPages/profile.js",
    "/pages/user_page/campaign-detail.html": "./UserPages/campaign-detail.js",
    "/pages/admin/admin-dashboard.html": "./Admin/admin-dashboard.js",
    "/pages/admin/admin-campaigns.html": "./Admin/admin-campaigns.js",
    "/pages/admin/admin-pledges.html": "./Admin/admin-pledges.js",
    "/pages/admin/users-management.html": "./Admin/users-management.js"
};

const currentPath = window.location.pathname.toLowerCase().replace(/\\/g, "/");
const matchedEntry = Object.entries(scriptMap).find(([key]) => currentPath.endsWith(key));
if (matchedEntry) {
    import(matchedEntry[1]).then((module) => {
        if (currentPath.endsWith("/pages/user_page/edit-campaign.html") && typeof module.initEditCampaignPage === "function") {
            module.initEditCampaignPage();
            return;
        }
        if (currentPath.endsWith("/pages/user_page/campaign-detail.html") && typeof module.initCampaignDetailsPage === "function") {
            module.initCampaignDetailsPage();
            return;
        }
        if (currentPath.endsWith("/pages/user_page/profile.html") && typeof module.initProfilePage === "function") {
            module.initProfilePage();
            return;
        }

        if (document.readyState !== "loading") {
            document.dispatchEvent(new Event("DOMContentLoaded"));
        }
    });
}

