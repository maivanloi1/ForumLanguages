
const btnUpPost = $('.post-up__btn')

const apiUpPost = `${api}posts`
const apiUpImage = `${api}upload/post`

window.addEventListener('load', function () {
    $('.header-account').style.display = 'flex'
    loadUser()
    checkTimeOut()
})

document.getElementById('post-file__input').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = $('.post-file__img');
            img.src = e.target.result;
            img.style.display = 'block';
            $('.icon').style.display = 'none';
            $('.post-file__label').style.display = 'none'
        };
        reader.readAsDataURL(file);
    }
})

btnUpPost.onclick = function () {
    let language = $('select[name="language"]').value
    let title = $('input[name="title"]').value
    let content = $('textarea[name="content"]').value

    callApiUpImage(language, title, content)
}

function callApiUpPost(language, title, content, img) {
    let data = {
        language,
        title,
        content,
        img
    }

    let option = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('authToken')
        },
        body: JSON.stringify(data)
    }

    fetch(apiUpPost, option)
        .then((res) => res.json())
        .then((data) => {
            if (data.result) {
                alert("Up Post Success")
                window.location.href = '../index.html?content=' + content
            } else {
                alert(data.message)
            }
        })
        .catch((error) => {
            console.log(error)
        })
}

function callApiUpImage(language, title, content) {
    let resultImage = ""
    let img = document.getElementById('post-file__input').files[0]

    if (img) {
        let formData = new FormData()
        formData.append('file', img)

        let option = {
            method: "POST",
            body: formData
        }

        fetch(apiUpImage, option)
            .then((res) => res.json())
            .then((data) => {
                if (data.result.valid === true) {
                    resultImage = data.result.link
                    callApiUpPost(language, title, content, resultImage)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
}

function loadUser(){
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