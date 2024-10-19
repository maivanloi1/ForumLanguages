const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const logoutbtn = $('.header-account__list-item:last-child .header-account__item-link')
const apiLogout = 'https://lephuocviet.io.vn/auth/logout'
const apiRefresh = 'https://lephuocviet.io.vn/auth/refresh'
logoutbtn.onclick = function(event){
    event.preventDefault()
    let token = {
        token: localStorage.getItem("authToken")
    }
    let option = {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(token)
    }
    fetch(apiLogout,option)
        .then(function(res){
            localStorage.removeItem("authToken")
            window.location.href = "../index.html"
        })
        .catch((error) => {
            console.log("Error: " + error)
        })
}
let activityTime =30 * 60 * 1000;
let activityTimeout;
function resetActivityTimeout() {
    clearTimeout(activityTimeout);
    activityTimeout = setTimeout(() => {
        document.addEventListener('mousemove', callApiRefresh)
        document.addEventListener('keydown', callApiRefresh)
        document.addEventListener('click', callApiRefresh)
    },activityTime)
}
 
function callApiRefresh(){
    let token = {
        token: localStorage.getItem("authToken")
    }
    let option = {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(token)
    }
    fetch(apiRefresh,option)
        .then((res) => res.json())
        .then((data) => {
            if(data.result){
                alert('Bạn đã không hoạt động trong 30 phút. Vui lòng đăng nhập lại!!');
                localStorage.removeItem("authToken")
                window.location.href = "../index.html"
            }
        })
        .catch((error) => {
            console.log("Error: " + error)
        })
}
window.onload = function() {
    document.addEventListener('mousemove', resetActivityTimeout)
    document.addEventListener('keydown', resetActivityTimeout)
    document.addEventListener('click', resetActivityTimeout)
    resetActivityTimeout()
};