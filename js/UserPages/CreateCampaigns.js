const form = document.getElementById("campaignForm");

const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const goalInput = document.getElementById("goal");
const deadlineInput = document.getElementById("deadline");
const descriptionInput = document.getElementById("description");

const imageUpload = document.getElementById("imageUpload");
const dropZone = document.getElementById("dropZone");
const imagePreview = document.getElementById("imagePreview");

const cancelBtn = document.querySelector(".btn-cancel");


if(form){
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = titleInput.value.trim();
    const category = categoryInput.value;
    const goal = parseFloat(goalInput.value);
    const deadline = deadlineInput.value;
    const description = descriptionInput.value.trim();

    // validation
    if (!title || !description || !deadline) {
        alert("Please fill all required fields");
        return;
    }

    if (goal <= 0 || isNaN(goal)) {
        alert("Goal must be a valid positive number");
        return;
    }

    const today = new Date();
    const selectedDate = new Date(deadline);

    if (selectedDate <= today) {
        alert("Deadline must be in the future");
        return;
    }
    const currentUser = getCurrentUser();
      const campaign = {
        id: Date.now(),
        title,
        category,
        goal,
        raised: 0,
        deadline,
        description,
        image: imageBase64,
        supporters: 0,
        ownerId: currentUser.id,
        status: "pending"
    };

    let campaigns=getData("campaigns",[]);
    campaigns.push(campaign);
    saveData("campaigns",campaigns);
    console.log("Saved", campaigns);
    alert("Campaign submitted for review");
    window.location.href = "browse-campaigns.html";

});


dropZone.addEventListener("click", () => {
    imageUpload.click();
});

let imageBase64 = "";

imageUpload.addEventListener("change", function () {
    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {
        imageBase64 = reader.result;

        imagePreview.innerHTML = `
            <img src="${imageBase64}" style="width:100%; border-radius:10px;" />
        `;
    };

    reader.readAsDataURL(file);
});
}

