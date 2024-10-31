const apiCmt = `${api}comments`

const btnCmt = $('.post-cmt__btn')
const frameCmt = $('.body-cmt')

let url = document.URL
let params = new URLSearchParams(url.split('?')[1])
let id = params.get('id')

let currentPage = 0

window.addEventListener('load', function () {
    $('.header-account').style.display = 'flex'
    loadUser()
    loadPostById()
    loadCommentByIdPost(currentPage)
    checkTimeOut()
})

btnShare.addEventListener('click',function(){
    getLinkShare(id)
})

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
                    $('.header-account__img').src = '../assets/images/avatar.png'
                }
            }
        })
        .catch((error) => {
            console.log(error)
        })
}

btnCmt.addEventListener('click', () => {
    upCmt()
})

function upCmt() {
    let request = new XMLHttpRequest()
    let url = 'https://moonlit-poetry-438713-c2.uc.r.appspot.com/comments'
    let token = localStorage.getItem('authToken')
    let content = $('textarea[name="comment"]')

    let data = {
        id_post: id,
        content: content.value
    }

    request.open('POST', url, true)
    request.setRequestHeader('Authorization', 'Bearer ' + token)
    request.setRequestHeader('Content-Type', 'application/json')

    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 201) {
            const cmt = JSON.parse(this.responseText)
            const cmtElement = document.createElement('div')
            cmtElement.classList.add('post-cmt__body')
            cmtElement.innerHTML = `
                        <div class="post-cmt__header">
                            <img src="${cmt.result.img_user || '../assets/images/avatar.png'}" alt="" class="post-cmt__img">
                            <h7 class="post-cmt__username">${cmt.result.name}</h7>
                            <span class="post-cmt__datetime">${cmt.result.date_created}</span>
                        </div>
    
                        <div class="post-cmt__content">
                            <span>${cmt.result.content}</span>
                        </div>
    
                        <div class="post-cmt__interact">
                            <a class="post-cmt__interact-like" href="#">Like</a>
                            <a class="post-cmt__interact-reply" href="#">Reply</a>
                        </div>
                    `
            frameCmt.prepend(cmtElement)
            content.value = ''
            let commentBtn = document.querySelector('.post-interact__comment-btn')
            let spanElement = commentBtn.querySelector('span')
            spanElement.innerText = parseInt(spanElement.innerText) + 1
        }
    }

    request.send(JSON.stringify(data))
}

function loadCommentByIdPost(page) {
    let params = {
        id_post: id,
        page,
        size: 5
    }

    let param = new URLSearchParams(params)

    let option = {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('authToken'),
        }
    }

    fetch(`${apiCmt}?${param.toString()}`, option)
        .then(res => res.json())
        .then(data => {
            if (data.result.content !== undefined) {
                data.result.content.forEach(cmt => {
                    const cmtElement = document.createElement('div')
                    cmtElement.classList.add('post-cmt__body')

                    cmtElement.innerHTML = `
                        <div class="post-cmt__header">
                            <img src="${cmt.img_user || '../assets/images/avatar.png'}" alt="" class="post-cmt__img">
                            <h7 class="post-cmt__username">${cmt.name}</h7>
                            <span class="post-cmt__datetime">${cmt.date_created}</span>
                        </div>
    
                        <div class="post-cmt__content">
                            <span>${cmt.content}</span>
                        </div>
    
                        <div class="post-cmt__interact">
                            <a class="post-cmt__interact-like" href="#">Like</a>
                            <a class="post-cmt__interact-reply" href="#">Reply</a>
                        </div>
                    `

                    frameCmt.appendChild(cmtElement)
                })
            }
        })
        .catch(error => {
            console.log(error)
        })
}

function isScrollEnd() {
    return framePost.scrollTop + framePost.clientHeight >= framePost.scrollHeight;
}

framePost.addEventListener('scroll', () => {
    if (isScrollEnd()) {
        currentPage++
        loadCommentByIdPost(currentPage)
    }
})

function loadPostById() {

    let option = {
        method: "GET",
        headers: {
            "Authorization": "Bearer "+ localStorage.getItem('authToken')
        }
    }

    fetch(apiLoadPostById + id,option)
        .then(res => res.json())
        .then(data => {
            if (data.result) {
                let urlProfile = `./profile.html?id=${data.result.id_user}`

                $('.post-header__user-name').innerText = data.result.name
                $('.post-header__user-name').setAttribute('href',urlProfile) 
                $('.post-header_user-link').setAttribute('href',urlProfile) 
                $('.post-header__user-datetime').innerText = data.result.date_created
                $('.post-header__user-kind').innerText = data.result.language
                $('.post-title__text').innerText = data.result.title
                $('.post-content__text').innerText = data.result.content

                if(data.result.user_like){
                    $('.post-interact__like-btn').innerHTML = `
                    <span>${data.result.likes}</span>
                    <i class="fa-solid fa-heart"></i>
                `
                    $('.post-interact__like-btn').classList.add('liked')
                }else{
                    $('.post-interact__like-btn').innerHTML = `
                    <span>${data.result.likes}</span>
                    <i class="fa-regular fa-heart"></i>
                `
                }
                
                $('.post-interact__comment-btn').innerHTML = `
                    <span>${data.result.comments}</span>
                    <i class="fa-regular fa-comment"></i>
                `
                if (data.result.img) {
                    $('.post-img__link-src').style.display = 'flex'
                    $('.post-img').style.display = 'flex'
                    $('.post-img__link-src').src = data.result.img
                } else {
                    $('.post-img__link-src').style.display = 'none'
                    $('.post-img').style.display = 'none'
                }

                if (data.result.img_user) {
                    $('.post-header__user-img').src = data.result.img_user
                } else {
                    $('.post-header__user-img').src = '../assets/images/avatar.png'
                }
            }
        })
}

btnLike.addEventListener('click', () => {
    if(checkToken()){
        likePost(id)          
    }else{
        alert('Please login to like post')
    }
})
