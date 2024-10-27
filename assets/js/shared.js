const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const logoutbtn = $('.header-account__list-item:last-child .header-account__item-link')

const apiRefresh = `${api}auth/refresh`
const apiLoadUser = `${api}users/my-infor`
const apiSearch = `${api}posts?`
const apiLogout = `${api}auth/logout`

let activityTime = 30 * 60 * 1000
let activityTimeout

const btnSearch = $('.header-search__btn')
const searchInput = $('input[name="search"]')

btnSearch.addEventListener('click',() => {
    search()
})

searchInput.addEventListener('keypress', (e) => {
    if(e.key == "Enter"){
        search()
    }
})


logoutbtn.addEventListener('click',  (event) => {
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
            window.location.href = "pages/login.html"
        })
        .catch((error) => {
            console.log("Error: " + error)
        })
})

function search(){
    window.location.href = 'index.html?content=' + searchInput.value
}

function checkTimeOut() {
    document.addEventListener('mousemove', resetActivityTimeout)
    document.addEventListener('keydown', resetActivityTimeout)
    document.addEventListener('click', resetActivityTimeout)
    resetActivityTimeout()
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