const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const btnRegister = $('.register-form__submit-btn')

const apiRegister = `${api}users`

const nameError = $('.register-form__name-message')
const emailError = $('.register-form__email-message')
const languageError = $('.register-form__language-message')
const sexError = $('.register-form__sex-message')
const usError = $('.register-form__username-message')
const pwError = $('.register-form__password-message')
const rePwError = $('.register-form__repassword-message')

btnRegister.onclick = function () {
    let name = $('input[name="name"]').value
    let email = $('input[name="email"]').value
    let language = $('select[name="language"]').value
    let sex = $('select[name="sex"]').value
    let username = $('input[name="username"]').value
    let password = $('input[name="password"]').value
    let repassword = $('input[name="repassword"]').value
    if (checkVal(name, email, language, sex, username, password, repassword)) {
        let data = {
            name,
            email,
            language,
            sex,
            username,
            password,
            repassword,
        }
        let option = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        fetch(apiRegister, option)
            .then((res) => res.json())
            .then((data) => {
                if (!data.result) {
                    showError(data.code, data.message)
                } else {
                    alert("Register Success")
                    window.location.href = 'login.html'
                }
            })
            .catch((error) =>{
                console.log("Error: "+error)
            })
    }
}

function showError(code, message) {
    if (code === 40001) {
        usError.innerText = message
        usError.classList.add('error-active')
    } else {
        emailError.innerText = message
        emailError.classList.add('error-active')
    }
}

function checkVal(name, email, language, sex, username, password, repassword) {
    let check = true
    nameError.innerText = ''
    emailError.innerText = ''
    languageError.innerText = ''
    sexError.innerText = ''
    usError.innerText = ''
    pwError.innerText = ''
    rePwError.innerText = ''
    nameError.classList.remove('error-active')
    emailError.classList.remove('error-active')
    languageError.classList.remove('error-active')
    sexError.classList.remove('error-active')
    usError.classList.remove('error-active')
    pwError.classList.remove('error-active')
    rePwError.classList.remove('error-active')
    if (name.trim() === '') {
        check = false
        nameError.innerText = "Name is required"
        nameError.classList.add('error-active')
    }
    if (email.trim() === '') {
        check = false
        emailError.innerText = "Email is required"
        emailError.classList.add('error-active')
    } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailPattern.test(email)) {
            check = false
            emailError.innerText = "Email is Invalid"
            emailError.classList.add('error-active')
        }
    }
    if (language.trim() === '') {
        check = false
        languageError.innerText = "Language is required"
        languageError.classList.add('error-active')
    }
    if (sex.trim() === '') {
        check = false
        sexError.innerText = "Sex is required"
        sexError.classList.add('error-active')
    }
    if (username.trim() === '') {
        check = false
        usError.innerText = "Username is required."
        usError.classList.add('error-active')
    } else if (username.length < 5) {
        check = false
        usError.innerText = "Username min 5 characters."
        usError.classList.add('error-active')
    } else if (username.length > 15) {
        check = false
        usError.innerText = "Username max 15 characters."
        usError.classList.add('error-active')
    }
    if (password.trim() === '') {
        check = false
        pwError.innerText = "Password is required."
        pwError.classList.add('error-active')
    } else if (password.length < 5) {
        check = false
        pwError.innerText = "Password min 5 characters."
        pwError.classList.add('error-active')
    } else if (password.length > 15) {
        check = false
        pwError.innerText = "Password max 15 characters."
        pwError.classList.add('error-active')
    }
    if (repassword.trim() === '') {
        check = false
        rePwError.innerText = "Password Confirm is required."
        rePwError.classList.add('error-active')
    }
    if (repassword !== '' && password !== '') {
        if (repassword !== password) {
            check = false
            rePwError.innerText = "Password confirm does not match password."
            rePwError.classList.add('error-active')
        }
    }
    return check
}