const btnSend = document.querySelector('.active-form__send-btn')
const textTime = document.querySelector('.active-form__email-time')
const linkLogin = document.querySelector('.active-form__other-link')

const apiSend = `${api}mail/send`

let sendTime = 90
let sendTimeout

function resetSendTimeout() {
    let timeLeft = sendTime
    textTime.textContent = `${timeLeft}s`
    btnSend.disabled = true;
    sendTimeout = setInterval(() => {
        timeLeft--;
        textTime.textContent = `${timeLeft}s`
        if (timeLeft <= 0) {
            clearInterval(sendTimeout);
            textTime.style.display = 'none'
            btnSend.disabled = false;
        }
    }, 1000)
}

btnSend.onclick = function () {
    textTime.style.display = 'block'
    let option = {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('authToken')
        },
    }
    fetch(apiSend, option)
        .then((res) => res.json())
        .then((data) => {
            if (data.result) {
                localStorage.setItem('authToken', data.result.token)
                window.location.href = 'send-email.html'
            }
        })
        .catch((error) => {
            {
                console.log(error)
            }
        })
    resetSendTimeout()
};
linkLogin.onclick = function () {
    localStorage.removeItem('authToken')
    window.location.href = "./login.html"
}