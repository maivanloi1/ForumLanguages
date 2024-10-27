const apiLoadPostById = `${api}posts/`


window.addEventListener('load', function () {
    $('.header-account').style.display = 'flex'
    loadUser()
    loadPostById()
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

function loadPostById(){
    let url = document.URL
    let params = new URLSearchParams(url.split('?')[1])

    let id = params.get('id')

    fetch(apiLoadPostById+id)
        .then( res => res.json() )
        .then( data => {
            if(data.result){
                $('.post-header__user-name').innerText = data.result.name
                $('.post-header__user-datetime').innerText = data.result.date_created
                $('.post-header__user-kind').innerText = data.result.language
                $('.post-kind__heading').innerText = data.result.title
                $('.post-content__text').innerText = data.result.content
                $('.post-interact__like-btn').innerHTML = `
                    ${data.result.likes}
                    <i class="fa-solid fa-heart"></i>
                `
                $('.post-interact__comment-btn').innerHTML = `
                    ${data.result.comments}
                    <i class="fa-solid fa-comment"></i>
                `
                $('.post-interact__share-btn').innerHTML = `
                    ${data.result.shares}
                    <i class="fa-solid fa-share"></i>
                `
                if(data.result.img){
                    $('.post-img__src').style.display = 'flex'
                    $('.post-img').style.display = 'flex'
                    $('.post-img__src').src = data.result.img
                }else{
                    $('.post-img__src').style.display = 'none'
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