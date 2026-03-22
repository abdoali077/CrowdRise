function initializeLocalStorage(){
    if (!localStorage.getItem("users")) {
        saveData("users", []);
    }

    if(!localStorage.getItem("campaigns")){
        saveData("campaigns", []);
    }

    if(!localStorage.getItem("pledges")){
        saveData("pledges", []);
    }
if(!localStorage.getItem("supports")){
    saveData("supports",[]);
}

    let users = getData("users");
    if(!users.find(u => u.role === "admin")){
        users.push({
            id: Date.now(),
            name: "Admin",
            email: "admin@test.com",
            password: "admin123",
            role: "admin",
            isActive: true
        });
        
    }

    if(!users.find(u=>u.role==="user")){
        users.push({ id: Date.now() + 1,
            name: "Normal User",
            email: "user@test.com",
            password: "123456",
            role: "user",
            isActive: true
        });
    }
    saveData("users", users);
    console.log("admin and user  added ");

    
}

initializeLocalStorage();