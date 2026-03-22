function getData(key){
    return JSON.parse(localStorage.getItem(key))||[];  
}

/*------------------------------ */

function saveData(key,data){
    localStorage.setItem(key,JSON.stringify(data));
    return data;
}

/*------------------------------ */

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}
/*------------------------------ */
function login(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
}
/*------------------------------ */
function logout() {
    localStorage.removeItem("currentUser");
}