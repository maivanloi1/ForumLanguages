const btnCreate = $('.header-create__link')
const btnHome = $('.header-logo__link')

const apiLoadPost = `${api}posts`
var listBtnShare  = ''
let currentPage = 0

window.addEventListener('load', function () {
    loadPost(currentPage)
    let token = localStorage.getItem('authToken')
    if (token) {
        let option = {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        }

        fetch(apiLoadUser, option)
            .then((res) => res.json())
            .then((data) => {
                if (data.result) {
                    $('.header-account__username').innerText = data.result.name
                    $('.header-account').style.display = 'flex'
                    checkTimeOut()
                    if (data.result.img) {
                        $('.header-account__img').src = data.result.img
                    } else {
                        $('.header-account__img').src = 'assets/images/avatar.png'
                    }
                }
            })
            .catch(() => {
                this.localStorage.removeItem('authToken')
                $('.header-auth').style.display = 'flex'
                btnCreate.onclick = (event) => {
                    event.preventDefault()
                    this.alert("Login is required")
                }
            })
    } else {
        $('.header-auth').style.display = 'flex'
        btnCreate.onclick = (event) => {
            event.preventDefault()
            this.alert("Login is required")
        }
    }
})

btnHome.addEventListener('click',() => {
    let url = document.URL
    let urlEndPoint = url.substring(url.lastIndexOf('/')+1)
    if(urlEndPoint !== 'index.html'){
        btnHome.setAttribute('href','./index.html')
    }else{
        btnHome.setAttribute('href','')
    }
})

function isScrollEnd() {
    return framePost.scrollTop + framePost.clientHeight >= framePost.scrollHeight
}

framePost.addEventListener('scroll', () => {
    if (isScrollEnd()) {
        currentPage++
        loadPost(currentPage)
    }
})

function loadPost(page) {

    let url = document.URL
    let urlParam = new URLSearchParams(url.split('?')[1])

    let content = urlParam.get('content')

    if (content === null) {
        content = ''
    }

    let params = {
        page,
        size: 4,
        content,
        language: "",
    }

    let param = new URLSearchParams(params);

    let option = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    let token = localStorage.getItem('authToken')

    if(token){
        option.headers.Authorization=  "Bearer " + token
    }

    fetch(`${apiLoadPost}?${param.toString()}`, option)
        .then((res) => res.json())
        .then((data) => {
            if (data.result) {
                data.result.content.forEach((post) => {
                    const postElement = document.createElement('div')
                    postElement.classList.add('post')
                    let urlProfile = `./pages/profile.html?id=${post.id_user}`
                    let urlPost = `./pages/post-detail.html?id=${post.id}`

                    postElement.innerHTML = `
                        <div class="post-body">
                            <div class="post-header">
                                <div class="post-header__user">
                                    <a href="${urlProfile}" class="post-header_user-link"><img src="${post.img_user || './assets/images/avatar.png'}" alt="" class="post-header__user-img"></a>
                                    <a href="${urlProfile}" class="post-header__user-name">${post.name}</a> 
                                    <a href="${urlPost}" class="post-header__user-datetime">${post.date_created}</a>
                                    <a href="${urlPost}" class="post-header__user-kind">${post.language}</a>
                                </div>
                                <div class="post-header__more">
                                    <button class="post-header__more-btn">
                                        <i class="fa-solid fa-ellipsis"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="post-title">
                                <a href="${urlPost}" class="post-title__text">${post.title}</a>
                            </div>
                            <div class="post-content">
                                <a href="${urlPost}" class="post-content__text"> ${post.content.replace(/\n/g, '<br>')} </a>
                            </div>
                           <div class="post-img" style="${post.img ? 'display: flex;' : 'display: none;'}">
                                <a href="${urlPost}" class="post-img__link"><img src="${post.img || ''}" style="${post.img ? 'display: flex;' : 'display: none;'}" class="post-img__link-src"></a>
                            </div>
                            <div class="post-interact">
                                <div class="post-interact__like">
                                    <button id="${post.id}" class="post-interact__like-btn">
                                        <span>${post.likes}</span>  
                                        <i class="fa-regular fa-heart"></i>
                                    </button>
                                </div>
                                <div class="post-interact__comment">
                                    <button class="post-interact__comment-btn">
                                        <span>${post.comments}</span>
                                        <i class="fa-regular fa-comment"></i>
                                    </button>
                                </div>
                                <div class="post-interact__share">
                                    <button id-post="${post.id}" class="post-interact__share-btn">
                                        <i class="fa-solid fa-share"></i>
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>
                        `
                    framePost.appendChild(postElement)
                    const likeButton = postElement.querySelector('.post-interact__like-btn');
                    const likeIcon = likeButton.querySelector('i');
                    const shareButton = postElement.querySelector('.post-interact__share-btn')

                    if (post.user_like) {
                        likeButton.classList.add('liked');
                        likeIcon.classList.add('fa-solid');
                        likeIcon.classList.remove('fa-regular');
                    } else {
                        likeButton.classList.remove('liked');
                        likeIcon.classList.remove('fa-solid');
                        likeIcon.classList.add('fa-regular');
                    }

                    likeButton.addEventListener('click',()=> {
                        if(checkToken()){
                            const id = likeButton.getAttribute('id')
                            const buttonLike = document.getElementById(id)
                            likePost(id,buttonLike)
                        }else{
                            alert('Please login to like post')
                        }
                    })

                    shareButton.addEventListener('click',() => {
                        const id =  shareButton.getAttribute('id-post')
                        getLinkShare(id)
                    })
                })
            } else if (data.code === 40405) {
                alert("Bạn đã lướt hết bài viết !!!")
            }
        })
        .catch((error) => {
            console.log(error)
        })
}
