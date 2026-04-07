let users = JSON.parse(localStorage.getItem("users")) || [];


const adminText = document.querySelector(".admin-text .name");
const admin = JSON.parse(localStorage.getItem("currentUser"));

if (adminText && admin) {
    adminText.textContent = admin.name || "Admin";
}

const tableBody = document.getElementById("usersTableBody");
const userCount = document.getElementById("userCount");
const searchInput = document.getElementById("userSearch");
const statusFilter = document.getElementById("statusFilter");

let currentPage = 1;
const rowsPerPage = 5;


  // Render Users

function renderUsers(data) {
    tableBody.innerHTML = "";

    userCount.textContent = data.length;

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    const paginatedUsers = data.slice(start, end);

    paginatedUsers.forEach(user => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.status === "banned" ? "banned" : "active"}</td>
            <td>${user.date || "N/A"}</td>
            <td class="action-btns">
                <button class="action-btn view-btn" data-id="${user.id}">
                    <i class="fa-solid fa-eye"></i>
                </button>
                <button class="action-btn edit-btn" data-id="${user.id}">
                    <i class="fa-solid fa-user-slash"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${user.id}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;

        tableBody.appendChild(tr);
    });

    updatePagination(data.length);
}

renderUsers(users);


searchInput.addEventListener("input", filterAndRender);
statusFilter.addEventListener("change", filterAndRender);

function filterAndRender() {
    currentPage = 1; 

    const searchValue = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value;

    let filtered = users.filter(user => {
        const matchSearch =
            user.name.toLowerCase().includes(searchValue) ||
            user.email.toLowerCase().includes(searchValue);

        const matchStatus =
            statusValue === "all" || 
            (user.status === "banned" ? "banned" : "active") === statusValue;

        return matchSearch && matchStatus;
    });

    renderUsers(filtered);
}


  // Pagination

function updatePagination(total) {
    const pageInfo = document.querySelector(".page-info");
    const totalPages = Math.ceil(total / rowsPerPage) || 1;

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Buttons 
const prevBtn = document.querySelector(".page-btn:nth-of-type(1)");
const nextBtn = document.querySelector(".page-btn:nth-of-type(2)");

prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        filterAndRender();
    }
});

nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(users.length / rowsPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        filterAndRender();
    }
});


tableBody.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = btn.dataset.id;

    const user = users.find(u => u.id == id);
    if (!user) return;


    if (btn.classList.contains("view-btn")) {
        showUserModal(user);
    }

    if (btn.classList.contains("edit-btn")) {
        user.status = user.status === "banned" ? "active" : "banned";

        localStorage.setItem("users", JSON.stringify(users));
        filterAndRender();
    }

    if (btn.classList.contains("delete-btn")) {
        if (confirm("Are you sure?")) {
            users = users.filter(u => u.id != id);

            localStorage.setItem("users", JSON.stringify(users));
            filterAndRender();
        }
    }
});


const modal = document.getElementById("userModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.querySelector(".close-modal");

function showUserModal(user) {
    modal.style.display = "flex";

    modalBody.innerHTML = `
        <p><strong>Name:</strong> ${user.name || "N/A"}</p>
        <p><strong>Email:</strong> ${user.email || "N/A"}</p>
        <p><strong>Status:</strong> ${user.status === "banned" ? "banned" : "active"}</p>
        <p><strong>Date:</strong> ${user.date || "N/A"}</p>
    `;
}

/* Close modal */
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

document.querySelectorAll(".sidebar-nav li").forEach(item => {
    item.addEventListener("click", () => {
        const text = item.innerText.toLowerCase();

        if (text.includes("overview")) {
            window.location.href = "admin-dashboard.html";
        } else if (text.includes("users")) {
            window.location.href = "users-management.html";
        } else if (text.includes("campaigns")) {
            window.location.href = "admin-campaigns.html";
        } else if (text.includes("pledges")) {
            window.location.href = "admin-pledges.html";
        } else if (text.includes("settings")) {
            window.location.href = "settings.html";
        }
    });
});
    const logoutBtn = document.querySelector(".logout-btn");
 if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            if (typeof logout === 'function') {
                logout();
            } else {
                localStorage.removeItem("currentUser");
            }

            window.location.href = "../login.html";
        });
}
