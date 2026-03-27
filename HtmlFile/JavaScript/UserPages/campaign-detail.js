document.addEventListener("DOMContentLoaded", () => {

    const campaigns = getData("campaigns", []);
    const selectedCampaignId = localStorage.getItem("selectedCampaignId");

    if (!selectedCampaignId) {
        alert("No campaign selected");
        return;
    }

    const campaign = campaigns.find(c => c.id == selectedCampaignId);

    if (!campaign) {
        alert("Campaign not found");
        return;
    }

    // ================= NAVBAR =================
    const currentUser = getCurrentUser();
    const backLink = document.querySelector(".back-link");

    if (!currentUser) {
        backLink.textContent = "Back to Home";
        backLink.href = "../home.html";
    }

    // ================= HEADER =================
    const headerTitle = document.querySelector(".campaign-header h1");
    const headerTagline = document.querySelector(".campaign-header .tagline");
    const categoryBadge = document.querySelector(".badge.category");
    const statusBadge = document.querySelector(".badge.status-active");

    headerTitle.textContent = campaign.title;
    headerTagline.textContent = campaign.description.substring(0, 100) + "...";
    categoryBadge.textContent = campaign.category || "General";

    // ================= IMAGE =================
    const coverImage = document.querySelector(".cover-image");
    coverImage.src = campaign.image || "https://via.placeholder.com/1200x600";

    // ================= STATS =================
    const raisedText = document.querySelector(".stats-card .stat-value");
    const raisedLabel = document.querySelector(".stats-card .stat-label");
    const backersText = document.querySelector(".stats-card .stats-grid .stat-mini:first-child .mini-value");
    const daysLeftText = document.querySelector(".stats-card .stats-grid .stat-mini:last-child .mini-value");
    const progressBar = document.querySelector(".stats-card .progress-bar");

    // حساب الأيام المتبقية
    const today = new Date();
    const deadline = new Date(campaign.deadline);
    const daysLeft = Math.max(0, Math.ceil((deadline - today) / (1000 * 60 * 60 * 24)));
    daysLeftText.textContent = daysLeft;

    // تحديث Raised و Backers و Progress
    raisedText.textContent = `$${campaign.raised.toLocaleString()}`;
    raisedLabel.textContent = `raised of $${campaign.goal.toLocaleString()} goal`;
    backersText.textContent = campaign.supporters || 0;
    const percentFunded = Math.min((campaign.raised / campaign.goal) * 100, 100);
    progressBar.style.width = percentFunded + "%";

    // تحديد حالة الحملة بناءً على status و deadline
    if ((campaign.status && campaign.status.toLowerCase() === "active") && daysLeft > 0) {
        statusBadge.textContent = "Active";
        statusBadge.classList.add("status-active");
        statusBadge.classList.remove("status-closed");
    } else {
        statusBadge.textContent = "Closed";
        statusBadge.classList.remove("status-active");
        statusBadge.classList.add("status-closed");
    }
    // ================= DYNAMIC ALL-OR-NOTHING TEXT =================
    const allOrNothingText = document.querySelector(".all-or-nothing");
    allOrNothingText.textContent = `This project will only be funded if it reaches its goal by ${deadline.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}.`;
    // ================= DESCRIPTION =================
    const descriptionSection = document.querySelector(".description-section p");
    descriptionSection.textContent = campaign.fullDescription || campaign.description;

    // ================= SUPPORT BUTTON =================
    const supportBtn = document.querySelector(".btn-support");
    supportBtn.addEventListener("click", () => {

        if (!currentUser) {
            alert("Please login first to back this project!");
            return;
        }

        const amount = prompt("Enter pledge amount:");

        if (!amount || isNaN(amount) || amount <= 0) {
            alert("Invalid amount");
            return;
        }

        let pledges = getData("pledges", []);

        pledges.push({
            id: Date.now(),
            userId: currentUser.id,
            userName: currentUser.name,
            campaignId: campaign.id,
            campaignTitle: campaign.title,
            amount: Number(amount),
            date: new Date().toLocaleDateString()
        });


        campaign.raised += Number(amount);
        campaign.supporters = (campaign.supporters || 0) + 1;

        localStorage.setItem("pledges", JSON.stringify(pledges));
        localStorage.setItem("campaigns", JSON.stringify(campaigns));

        alert("Thank you for supporting this project! 🎉");


        raisedText.textContent = `$${campaign.raised.toLocaleString()}`;
        raisedLabel.textContent = `raised of $${campaign.goal.toLocaleString()} goal`;
        backersText.textContent = campaign.supporters;
        progressBar.style.width = Math.min((campaign.raised / campaign.goal) * 100, 100) + "%";
    });

});