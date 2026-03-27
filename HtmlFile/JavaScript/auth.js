const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("user-email").value;
        const password = document.getElementById("user-password").value;

        const users = getData("users") || [];

        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            alert("Invalid email or password");
            return;
        }

       
        if (user.status === "banned") {
            alert("Your account is banned ❌");
            return;
        }

        login(user);
        alert("Login successful");

        if (user.role === "admin") {
            window.location.href = "Admin/admin-dashboard.html";
        } else {
            window.location.href = "Home.html";
        }
    });
}

const registerForm = document.getElementById("register-form");

if (registerForm) {

    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const fullName = document.getElementById("full-name").value.trim();
        const email = document.getElementById("user-email").value.trim();
        const password = document.getElementById("user-password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        const users = getData("users") || [];

        // Regex
        const nameRegex = /^[a-zA-Z\s]{3,}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

        if (!nameRegex.test(fullName)) {
            alert("Name must be at least 3 letters and contain only characters");
            return;
        }

        if (!emailRegex.test(email)) {
            alert("Invalid email format");
            return;
        }

        if (!passwordRegex.test(password)) {
            alert("Password must be at least 6 chars, include 1 capital letter and 1 number");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const userExists = users.find(u => u.email === email);

        if (userExists) {
            alert("Email already exists");
            return;
        }

        const newUser = {
            id: Date.now(),
            name: fullName,
            email: email,
            password: password,
            role: "user",
            status: "active" 
        };

        users.push(newUser);
        saveData("users", users);

        alert("Registered successfully");

        window.location.href = "login.html";
    });

}