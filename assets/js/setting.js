
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
                $('.header-account__username').innerText = data.result.name
                $('.setting-email__info').innerText = data.result.email
                $('.setting-gender__button-gender').innerHTML = `
                    ${data.result.sex}
                    <i class="fa-solid fa-chevron-down"></i>
                `
                $('.setting-language__button-language').innerHTML = `
                    ${data.result.language}
                    <i class="fa-solid fa-chevron-down"></i>
                `
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