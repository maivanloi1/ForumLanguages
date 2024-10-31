const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const logoutbtn = $('.header-account__list-item:last-child .header-account__item-link')
const btnLike = $('.post-interact__like-btn')
const btnShare = $('.post-interact__share-btn')
const framePost = $('.posts')

const apiRefresh = `${api}auth/refresh`
const apiLoadUser = `${api}users/my-infor`
const apiSearch = `${api}posts?`
const apiLogout = `${api}auth/logout`
const apiLike = `${api}likes`
const apiLoadPostById = `${api}posts/`

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

function checkToken(){
    if(localStorage.getItem('authToken')){
        return true
    }else{
        return false

    }
}

function getLinkShare(id){
    const url = `https://maivloi2003.github.io/ForumLanguages/pages/post-detail.html?id=${id}`
    navigator.clipboard.writeText(url)
        .then(() => {
            alert('Get link post success')
        })
        .catch(() => {
            alert('Get link post failed')
        })
}


logoutbtn.addEventListener('click',  (event) => {
    event.preventDefault()
    
    let url = document.URL
    let urlEndPoint = url.substring(url.lastIndexOf('/')+1)

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
            if(urlEndPoint.startsWith('index.html')){
                window.location.href = 'pages/login.html'
            }else{
                window.location.href = 'login.html'
            }
        })
        .catch((error) => {
            console.log("Error: " + error)
        })
})

function search(){
    let url = document.URL
    let urlEndPoint = url.substring(url.lastIndexOf('/')+1)
    if(urlEndPoint === 'index.html' || urlEndPoint === ''){
        window.location.href = './index.html?content=' + searchInput.value
    }else{
        window.location.href = '../index.html?content=' + searchInput.value
    }
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

function likePost(id_post,elementLike) {

    let option = {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('authToken')
        }
    }

    

    fetch(apiLoadPostById + id_post, option)
        .then(res => res.json())
        .then(data => {

            let dataLike = {
                id_post,
                liked: false
            }

            if (!data.result.user_like) {
                dataLike.liked = true
            } else {
                dataLike.liked = false
            }
            return dataLike
        })
        .then((data) => {
            let request = new XMLHttpRequest()

            request.open('POST', apiLike, true)

            request.setRequestHeader('Content-Type', 'application/json')
            request.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('authToken')}`)

            request.onreadystatechange = function () {
                
                if (this.readyState === 4 && this.status === 200) {
                    const data = JSON.parse(this.responseText)
                    if(elementLike === undefined ){
                        elementLike = $('.post-interact__like-btn')
                    }
                    const spanElement = elementLike.querySelector('span')
                    if (data.result.liked) {
                        elementLike.querySelector('i').classList.add('fa-solid')
                        elementLike.querySelector('i').classList.remove('fa-regular')
                        spanElement.innerText = parseInt(spanElement.innerText) + 1
                        elementLike.classList.add('liked')
                    } else {
                        elementLike.querySelector('i').classList.remove('fa-solid')
                        elementLike.querySelector('i').classList.add('fa-regular')
                        spanElement.innerText = parseInt(spanElement.innerText) - 1
                        elementLike.classList.remove('liked')
                    }
                }
                
            }
            request.send(JSON.stringify(data))
        })
        .catch(error => {
            console.log(error)
        })
}