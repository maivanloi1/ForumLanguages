const btnSend = document.querySelector('.forgot-form__send-btn')
const emailError = document.querySelector('.login-form__email-message')

const apiResetPW = `${api}mail/reset`

btnSend.onclick = function () {
    let email = document.querySelector('input[name="email"]').value
    if (checkVal(email)) {
        let data = {
            email,
        }
        let option = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }
        fetch(apiResetPW, option)
            .then((res) => res.json())
            .then((data) => {
                if (data.result) {
                    window.location.href = "send-email.html"
                } else {
                    emailError.innerText = data.message
                    emailError.classList.add('error-active')
                }
            })
            .catch((error) => {
                console.log("Error: " + error)
            })
    }
}
function checkVal(mail) {
    let check = true
    emailError.innerText = ''
    emailError.classList.remove('error-active')
    if (mail.trim() === '') {
        check = false
        emailError.innerText = "Email is required"
        emailError.classList.add('error-active')
    }
    return check
}