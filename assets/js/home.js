const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const logoutbtn = $('.header-account__list-item:last-child .header-account__item-link')

const apiLogout = `${api}auth/logout`
const apiRefresh = `${api}auth/refresh`
const apiPost = `${api}posts`

let activityTime = 30 * 60 * 1000;
let activityTimeout;

window.onload = function () {



    if(localStorage.getItem('authToken')){
        document.addEventListener('mousemove', resetActivityTimeout)
        document.addEventListener('keydown', resetActivityTimeout)
        document.addEventListener('click', resetActivityTimeout)
        resetActivityTimeout()
    }
}

logoutbtn.onclick = function (event) {
    event.preventDefault()
    let token = {
        token: localStorage.getItem("authToken")
    }
    let option = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(token)
    }
    fetch(apiLogout, option)
        .then(function (res) {
            localStorage.removeItem("authToken")
            window.location.href = "../index.html"
        })
        .catch((error) => {
            console.log("Error: " + error)
        })
}

function resetActivityTimeout() {
    clearTimeout(activityTimeout);
    activityTimeout = setTimeout(() => {
        document.addEventListener('mousemove', callApiRefresh)
        document.addEventListener('keydown', callApiRefresh)
        document.addEventListener('click', callApiRefresh)
    }, activityTime)
}

function callApiRefresh() {
    let token = {
        token: localStorage.getItem("authToken")
    }
    let option = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(token)
    }
    fetch(apiRefresh, option)
        .then((res) => res.json())
        .then((data) => {
            if (data.result) {
                alert('Bạn đã không hoạt động trong 30 phút. Vui lòng đăng nhập lại!!');
                localStorage.removeItem("authToken")
                window.location.href = "../index.html"
            }
        })
        .catch((error) => {
            console.log("Error: " + error)
        })
}

function loadPost() {

}