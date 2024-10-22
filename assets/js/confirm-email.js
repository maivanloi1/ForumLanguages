document.addEventListener('DOMContentLoaded', function () {
    const url = document.URL
    const urlParam = new URLSearchParams(url.split('?')[1])
    const token = urlParam.get('token')
    const apiVerify = `${api}mail/verify?token=${token}`

    let option = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }

    fetch(apiVerify, option)
        .then((res) => res.json())
        .then((data) => {
            if (data.result.success === true ) {
                document.querySelector('.content-header__heading').innerText = "Active Success"
                document.querySelector('.content-header__title').innerText = "You have successfully activated your account. Please log in to your account and experience it."
                document.querySelector('.content-header__link').innerText = "Go to the login page!"
            } else {
                document.querySelector('.content-header__heading').innerText = "Active Success"
                document.querySelector('.content-header__title').innerText = data.message
            }
        })
})