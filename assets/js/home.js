const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const logoutbtn = $('.header-account__list-item:last-child .header-account__item-link')
const btnCreate = $('.header-create__link')
const framePost = $('.posts')

const apiLogout = `${api}auth/logout`
const apiRefresh = `${api}auth/refresh`
const apiLoadPost = `${api}posts`
const apiLoadUser = `${api}users/my-infor`

let activityTime = 30 * 60 * 1000
let activityTimeout
let currentPage = 0

window.addEventListener('load', function () {
    loadPost(currentPage)
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
            window.location.href = "pages/login.html"
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
                window.location.href = "pages/login.html"
            }
        })
        .catch((error) => {
            console.log("Error: " + error)
        })
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

function isScrollEnd() {
    return framePost.scrollTop + framePost.clientHeight >= framePost.scrollHeight;
}

framePost.addEventListener('scroll', () => {
    if (isScrollEnd()) {
        currentPage++
        loadPost(currentPage)
    }
})

function loadPost(page) {

    let params = {
        page,
        size: 4,
        content: "",
        language: "",
    }

    let param = new URLSearchParams(params);

    fetch(`${apiLoadPost}?${param.toString()}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.result) {
                data.result.content.forEach((post) => {
                    const postElement = document.createElement('div')
                    postElement.classList.add('post')


                    postElement.innerHTML = `
                        <div class="post-body">
                            <div class="post-header">
                                <div class="post-header__user">
                                    <img src="${post.img || './assets/images/avatar.png'}" alt="" class="post-header__user-img">
                                    <h6 class="post-header__user-name">${post.name}</h6>
                                    <span class="post-header__user-datetime">${post.date_created}</span>
                                    <span class="post-header__user-kind">${post.language}</span>
                                </div>
                                <div class="post-header__more">
                                    <button class="post-header__more-btn">
                                        <i class="fa-solid fa-ellipsis"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="post-title">
                                <h3 class="post-title__text">${post.title}</h3>
                            </div>
                            <div class="post-content">
                                <span class="post-content__text"> ${post.content.replace(/\n/g,'<br>')} </span>
                            </div>
                           <div class="post-img" style="${post.img ? 'display: block;' : 'display: none;'}">
                                <img class="post-img__src" src="${post.img || ''}" style="${post.img ? 'display: block;' : 'display: none;'}">
                            </div>
                            <div class="post-interact">
                                <div class="post-interact__like">
                                    <button class="post-interact__like-btn">
                                        <i class="fa-solid fa-heart"></i>
                                        ${post.likes}
                                    </button>
                                </div>
                                <div class="post-interact__comment">
                                    <button class="post-interact__comment-btn">
                                        <i class="fa-solid fa-comment"></i>
                                        ${post.comments}
                                    </button>
                                </div>
                                <div class="post-interact__share">
                                    <button class="post-interact__share-btn">
                                        <i class="fa-solid fa-share"></i>
                                        ${post.shares}
                                    </button>
                                </div>
                            </div>
                        </div>
                    `
                    framePost.appendChild(postElement)
                })
            }else if(data.code === 40405){
                alert("Bạn đã lướt hết bài viết !!!")
            }
        })
        .catch((error) => {
            console.log(error)
        })
}

