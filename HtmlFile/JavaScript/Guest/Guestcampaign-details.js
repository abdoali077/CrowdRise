// Support buttons
document.querySelectorAll(".support-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const user = getCurrentUser();

         if (!user) {
            alert("Please login first");
            window.location.href = "login.html";
            return;
        }
 
    });
});