document.addEventListener("DOMContentLoaded", () => {

    const campaigns = getData("campaigns", []);
    const editId = localStorage.getItem("editCampaignId");

    
    if (!editId) {
        alert("No campaign selected");
        window.location.href = "my-campaigns.html";
        return;
    }

    const campaign = campaigns.find(c => c.id == editId);

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

    // fill data
    titleInput.value = campaign.title || "";
    descInput.value = campaign.description || "";
    goalInput.value = campaign.goal || "";
    categoryInput.value = campaign.category || "";
    deadlineInput.value = campaign.deadline || "";

 
    if (campaign.image) {
        previewArea.innerHTML = `<img src="${campaign.image}" width="300px">`;
    }

   
    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {
            previewArea.innerHTML = `<img src="${e.target.result}" width="100%">`;
        };

        reader.readAsDataURL(file);
    });


    form.addEventListener("submit", (e) => {
        e.preventDefault(); 

        const campaigns = getData("campaigns", []);
        const index = campaigns.findIndex(c => c.id == editId);

        if (index === -1) {
            alert("Error updating campaign");
            return;
        }

       
        campaigns[index].title = titleInput.value.trim();
        campaigns[index].description = descInput.value.trim();
        campaigns[index].goal = Number(goalInput.value);
        campaigns[index].category = categoryInput.value;
        campaigns[index].deadline = deadlineInput.value;

       
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                campaigns[index].image = e.target.result;

                saveData("campaigns", campaigns);
                finish();
            };

            reader.readAsDataURL(file);
        } else {
            saveData("campaigns", campaigns);
            finish();
        }

        function finish() {
            localStorage.removeItem("editCampaignId");

            alert("Updated successfully");

            window.location.href = "my-campaigns.html";
        }
    });

    const cancelBtn = document.querySelector(".btn-secondary");

    cancelBtn.addEventListener("click", () => {
        window.location.href = "my-campaigns.html";
    });

});



const logoutBtn = document.getElementById("btnLogoutt");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {

        const user = getCurrentUser();

        if (user) {
            logout();
        }

        window.location.href = "../Home.html";
    });
}