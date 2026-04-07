export function initCampaignDetailsPage() {
    const selectedCampaignId = localStorage.getItem("selectedCampaignId");
    const campaigns = getData("campaigns", []);
    const currentUser = getCurrentUser();

    const backLink = document.querySelector(".back-link");
    const titleEl = document.getElementById("campaignTitle");
    const taglineEl = document.getElementById("campaignTagline");
    const categoryEl = document.getElementById("campaignCategory");
    const statusBadge = document.getElementById("campaignStatusBadge");
    const coverImage = document.getElementById("campaignCoverImage");
    const descriptionEl = document.getElementById("campaignDescription");
    const sectionTitleEl = document.getElementById("campaignSectionTitle");
    const raisedEl = document.getElementById("campaignRaised");
    const goalLabelEl = document.getElementById("campaignGoalLabel");
    const progressBarEl = document.getElementById("campaignProgressBar");
    const backersEl = document.getElementById("campaignBackers");
    const daysLeftEl = document.getElementById("campaignDaysLeft");
    const deadlineTextEl = document.getElementById("campaignDeadlineText");
    const supportBtn = document.querySelector(".btn-support");

    if (!titleEl || !taglineEl || !categoryEl || !statusBadge || !coverImage || !descriptionEl || !raisedEl || !goalLabelEl || !progressBarEl || !backersEl || !daysLeftEl || !deadlineTextEl || !supportBtn) {
        return;
    }

    if (!currentUser && backLink) {
        backLink.textContent = "Back to Home";
        backLink.href = "../../index.html";
    }

    const campaign = campaigns.find((c) => c.id == selectedCampaignId);

    if (!selectedCampaignId || !campaign) {
        titleEl.textContent = "Campaign not found";
        taglineEl.textContent = "The selected campaign is unavailable.";
        descriptionEl.textContent = "Please go back and choose a valid campaign.";
        categoryEl.textContent = "General";
        statusBadge.textContent = "Closed";
        statusBadge.classList.remove("status-active");
        statusBadge.classList.add("status-closed");
        coverImage.src = "../../images/img1.png";
        raisedEl.textContent = "$0";
        goalLabelEl.textContent = "raised of $0 goal";
        progressBarEl.style.width = "0%";
        backersEl.textContent = "0";
        daysLeftEl.textContent = "Ended";
        deadlineTextEl.textContent = "This project is currently unavailable.";
        supportBtn.disabled = true;
        return;
    }

    function getDaysLeft(deadlineValue) {
        const deadline = new Date(deadlineValue);
        if (Number.isNaN(deadline.getTime())) return 0;
        return Math.max(0, Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24)));
    }

    function renderCampaignData() {
        const goal = Number(campaign.goal) || 0;
        const raised = Number(campaign.raised) || 0;
        const daysLeft = getDaysLeft(campaign.deadline);
        const isActive = daysLeft > 0;
        const progress = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

        titleEl.textContent = campaign.title || "Untitled Campaign";
        taglineEl.textContent = campaign.description || "No description available.";
        descriptionEl.textContent = campaign.fullDescription || campaign.description || "No details available.";
        if (sectionTitleEl) sectionTitleEl.textContent = "";
        categoryEl.textContent = campaign.category || "General";

        coverImage.src = campaign.image || "../../images/img1.png";
        coverImage.onerror = () => {
            coverImage.src = "../../images/img1.png";
        };

        statusBadge.textContent = isActive ? "Active" : "Closed";
        statusBadge.classList.toggle("status-active", isActive);
        statusBadge.classList.toggle("status-closed", !isActive);

        raisedEl.textContent = `$${raised.toLocaleString()}`;
        goalLabelEl.textContent = `raised of $${goal.toLocaleString()} goal (${Math.round(progress)}%)`;
        progressBarEl.style.width = `${progress}%`;
        backersEl.textContent = String(campaign.supporters || 0);
        daysLeftEl.textContent = isActive ? String(daysLeft) : "Ended";

        const deadline = new Date(campaign.deadline);
        if (!Number.isNaN(deadline.getTime())) {
            deadlineTextEl.textContent = `This project will only be funded if it reaches its goal by ${deadline.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            })}.`;
        } else {
            deadlineTextEl.textContent = "This project deadline is not available.";
        }
    }

    renderCampaignData();

    supportBtn.addEventListener("click", () => {
        if (!currentUser) {
            alert("Please login first to back this project!");
            return;
        }

        const amount = prompt("Enter pledge amount:");
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            alert("Invalid amount");
            return;
        }

        const pledges = getData("pledges", []);
        pledges.push({
            id: Date.now(),
            userId: currentUser.id,
            userName: currentUser.name,
            campaignId: campaign.id,
            campaignTitle: campaign.title,
            amount: Number(amount),
            date: new Date().toLocaleDateString()
        });

        campaign.raised = (Number(campaign.raised) || 0) + Number(amount);
        campaign.supporters = (campaign.supporters || 0) + 1;

        saveData("pledges", pledges);
        saveData("campaigns", campaigns);

        alert("Thank you for supporting this project! 🎉");
        renderCampaignData();
    });
}

