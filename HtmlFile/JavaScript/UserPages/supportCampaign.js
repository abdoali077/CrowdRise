function supportCampaign(campaignId) {

    const user = getCurrentUser();
    if (!user) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    const supports = getData("supports");

    
    const alreadySupported = supports.find(
        s => s.userId === user.id && s.campaignId === campaignId
    );

    if (alreadySupported) {
        alert("You already supported this campaign");
        return;
    }

    supports.push({
        userId: user.id,
        campaignId: campaignId,
        date: new Date().toISOString() 
    });

    saveData("supports", supports);

    alert("Supported successfully");
}


/////-----------------------
const btnSupport=document.querySelectorAll(".btn-support");
btnSupport.forEach(btn => {
    btn.addEventListener("click", () => {

        const campaignId = btn.getAttribute("data-id");

        supportCampaign(parseInt(campaignId));
    });
});