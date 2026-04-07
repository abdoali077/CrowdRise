export function initEditCampaignPage() {
    const campaigns = getData("campaigns", []);
    const pledges = getData("pledges", []);
    const editId = localStorage.getItem("editCampaignId");

    if (!editId) {
        alert("No campaign selected");
        window.location.href = "my-campaigns.html";
        return;
    }

    const campaign = campaigns.find((c) => c.id == editId);
    if (!campaign) {
        alert("Campaign not found");
        window.location.href = "my-campaigns.html";
        return;
    }

    const form = document.getElementById("editForm");
    const titleInput = document.getElementById("title");
    const descInput = document.getElementById("description");
    const goalInput = document.getElementById("goal");
    const categoryInput = document.getElementById("category");
    const deadlineInput = document.getElementById("deadline");
    const imageInput = document.getElementById("imageInput");
    const previewArea = document.getElementById("previewArea");
    const cancelBtn = document.querySelector(".btn-secondary");
    const logoutBtn = document.getElementById("btnLogoutt");

    const previewCampaignImage = document.getElementById("previewCampaignImage");
    const previewCampaignTitle = document.getElementById("previewCampaignTitle");
    const previewRaised = document.getElementById("previewRaised");
    const previewPercent = document.getElementById("previewPercent");
    const previewProgressFill = document.getElementById("previewProgressFill");
    const previewDaysLeft = document.getElementById("previewDaysLeft");
    const previewCategory = document.getElementById("previewCategory");
    const previewSupporters = document.getElementById("previewSupporters");
    const previewPledged = document.getElementById("previewPledged");
    const previewPledgesCount = document.getElementById("previewPledgesCount");

    if (!form || !titleInput || !descInput || !goalInput || !categoryInput || !deadlineInput || !imageInput || !previewArea) {
        return;
    }

    titleInput.value = campaign.title || "";
    descInput.value = campaign.description || "";
    goalInput.value = campaign.goal || "";
    categoryInput.value = campaign.category || "";
    deadlineInput.value = campaign.deadline || "";

    let previewImage = campaign.image || "../../images/img1.png";
    if (campaign.image) {
        previewArea.innerHTML = `<img src="${campaign.image}" width="300px">`;
    } else {
        previewArea.innerHTML = "<p>New Image Preview</p>";
    }

    function calculateDaysLeft(deadline) {
        if (!deadline) return 0;
        const today = new Date();
        const target = new Date(deadline);
        if (Number.isNaN(target.getTime())) return 0;
        return Math.max(0, Math.ceil((target - today) / (1000 * 60 * 60 * 24)));
    }

    function renderPreview() {
        const title = titleInput.value.trim() || "Untitled Campaign";
        const goal = Number(goalInput.value) || 0;
        const raised = Number(campaign.raised) || 0;
        const category = categoryInput.value || "General";
        const daysLeft = calculateDaysLeft(deadlineInput.value);
        const percent = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

        const pledgeList = pledges.filter((p) => p.campaignId == campaign.id);
        const pledgedAmount = pledgeList.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        const supporters = Number(campaign.supporters) || pledgeList.length;

        if (previewCampaignImage) previewCampaignImage.src = previewImage;
        if (previewCampaignTitle) previewCampaignTitle.textContent = title;
        if (previewRaised) previewRaised.textContent = `$${raised.toLocaleString()}`;
        if (previewPercent) previewPercent.textContent = `${Math.round(percent)}%`;
        if (previewProgressFill) previewProgressFill.style.width = `${percent}%`;
        if (previewDaysLeft) previewDaysLeft.textContent = `${daysLeft} Days Left`;
        if (previewCategory) previewCategory.textContent = category;
        if (previewSupporters) previewSupporters.textContent = String(supporters);
        if (previewPledged) previewPledged.textContent = `$${pledgedAmount.toLocaleString()}`;
        if (previewPledgesCount) previewPledgesCount.textContent = String(pledgeList.length);
    }

    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage = e.target.result || previewImage;
            previewArea.innerHTML = `<img src="${previewImage}" width="100%">`;
            renderPreview();
        };
        reader.readAsDataURL(file);
    });

    [titleInput, goalInput, categoryInput, deadlineInput, descInput].forEach((el) => {
        el.addEventListener("input", renderPreview);
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const allCampaigns = getData("campaigns", []);
        const index = allCampaigns.findIndex((c) => c.id == editId);

        if (index === -1) {
            alert("Error updating campaign");
            return;
        }

        allCampaigns[index].title = titleInput.value.trim();
        allCampaigns[index].description = descInput.value.trim();
        allCampaigns[index].goal = Number(goalInput.value);
        allCampaigns[index].category = categoryInput.value;
        allCampaigns[index].deadline = deadlineInput.value;

        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (ev) {
                allCampaigns[index].image = ev.target.result;
                saveData("campaigns", allCampaigns);
                finish();
            };
            reader.readAsDataURL(file);
        } else {
            saveData("campaigns", allCampaigns);
            finish();
        }
    });

    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            window.location.href = "my-campaigns.html";
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            const user = getCurrentUser();
            if (user) logout();
            window.location.href = "../../index.html";
        });
    }

    renderPreview();

    function finish() {
        localStorage.removeItem("editCampaignId");
        alert("Updated successfully");
        window.location.href = "my-campaigns.html";
    }
}

