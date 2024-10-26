const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const btnLogin = $('.login-form__submit-btn')

const apiLogin = `${api}auth/login`
const apiCheckActive = `${api}accounts/check`

const usError = $('.login-form__username-message')
const pwError = $('.login-form__password-message')

btnLogin.onclick = function () {
    let username = $('input[name="username"]').value
    let password = $('input[name="password"]').value
    if (checkVal(username, password)) {
        let data = {
            username,
            password
        }
        let option = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }
        fetch(apiLogin, option)
            .then((res) => res.json())
            .then((data) => {
                if (!data.result) {
                    showError(data.code, data.message)
                } else{
                    localStorage.setItem('authToken',data.result.token)
                    fetch(apiCheckActive,{
                        method: "POST",
                        headers: {
                            "Authorization": "Bearer " + localStorage.getItem('authToken')
                        }
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            if(data.result.active === true){
                                window.location.href = "../index.html"
                            }else{  
                                window.location.href = "active-account.html"
                            }
                        })
                        .catch((error) => {
                            console.log("Error: "+error)
                        })
                }
            })
            .catch((error) => {
                console.log("Error: " + error)
            })
    }
}
function showError(code, message) {
    if (code === 40401) {
        usError.innerText = message
        usError.classList.add('error-active')
    } else {
        pwError.innerText = message
        pwError.classList.add('error-active')
    }
}
function checkVal(username, password) {
    let check = true
    usError.innerText = ''
    pwError.innerText = ''
    usError.classList.remove('error-active')
    pwError.classList.remove('error-active')
    if (username.trim() === '') {
        check = false
        usError.innerText = "Username is required."
        usError.classList.add('error-active')
    }
    if (password.trim() === '') {
        check = false
        pwError.innerText = "Password is required."
        pwError.classList.add('error-active')
    }
    return check
}