const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const apiLoadUser = `${api}users/my-infor`
const apiRefresh = `${api}auth/refresh`

const btnCreate = $('.header-create__link')

let activityTime = 30 * 60 * 1000
let activityTimeout

window.addEventListener('load', function () {
    let token = localStorage.getItem('authToken')
    if (token) {
        $('.header-account').style.display = 'flex'
        loadUser()
        checkTimeOut()
    } else {
        $('.header-auth').style.display = 'flex'
        btnCreate.onclick = (event) => {
            event.preventDefault()
            this.alert("Login is required")
        }
    }
})

function checkTimeOut() {
    document.addEventListener('mousemove', resetActivityTimeout)
    document.addEventListener('keydown', resetActivityTimeout)
    document.addEventListener('click', resetActivityTimeout)
    resetActivityTimeout()
}

function loadUser() {

    let option = {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('authToken')
        }
    }

    fetch(apiLoadUser, option)
        .then((res) => res.json())
        .then((data) => {
            if (data.result) {
                $('.header-account__username').innerText = data.result.name

                if (data.result.img) {
                    $('.header-account__img').src = data.result.img
                } else {
                    $('.header-account__img').src = 'assets/images/avatar.png'
                }
            }
        })
        .catch((error) => {
            console.log(error)
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
                window.location.href = "pages/login.html"
            }
        })
        .catch((error) => {
            console.log("Error: " + error)
        })
}