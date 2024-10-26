const apiGetPostByUserId = `${api}posts/user/`

const framePost = $('.profile-body')

let currentPage = 0

window.addEventListener('load', function () {
    $('.header-account').style.display = 'flex'
    loadUser()
    checkTimeOut()
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
            nameUser = data.result.name
            imageUser = data.result.img
            idUSer = data.result.id
            $('.header-account__username').innerText = nameUser
            $('.profile-header__name').innerText = nameUser
            if (data.result.img) {
                $('.header-account__img').src = imageUser
                $('.profile-header__img-src').src = imageUser
            } else {
                $('.header-account__img').src = 'assets/images/avatar.png'
            }
            loadPost(currentPage)
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
        size: 4
    }

    let param = new URLSearchParams(params);

    fetch(`${apiGetPostByUserId}${idUSer}?${param.toString()}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.result) {
                data.result.content.forEach((post) => {
                    const postElement = document.createElement('div')
                    postElement.classList.add('post-body')


                    postElement.innerHTML = `
                            <div class="post-header">
                                <div class="post-header__user">
                                    <img src="${post.img_user || './assets/images/avatar.png'}" alt="" class="post-header__user-img">
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
                                <span class="post-content__text"> ${post.content.replace(/\n/g, '<br>')} </span>
                            </div>
                           <div class="post-img" style="${post.img ? 'display: flex;' : 'display: none;'}">
                                <img class="post-img__src" src="${post.img || ''}" style="${post.img ? 'display: flex;' : 'display: none;'}">
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
                    `
                    framePost.appendChild(postElement)
                })
            } else if (data.code === 40405) {
                alert("Bạn đã lướt hết bài viết !!!")
            }
        })
        .catch((error) => {
            console.log(error)
        })
}