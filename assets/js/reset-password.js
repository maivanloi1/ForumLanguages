const btnReset = document.querySelector('.resetPW-form__reset-btn')
const url = document.URL
const urlParam = new URLSearchParams(url.split('?')[1])

const token = urlParam.get('token')
const apiReset = `${api}mail/change?token=${token}`

const pwError = document.querySelector('.resetPW-form__password-message')
const rePwError = document.querySelector('.resetPW-form__repassword-message')

btnReset.onclick = function(){
    let password = document.querySelector('input[name="password"]').value
    let repassword = document.querySelector('input[name="repassword"]').value
    if(checkVal(password,repassword)){
        let data = {
            password,
            repassword,
        }
        let option = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }
        fetch(apiReset,option)
            .then((res) => res.json())
            .then((data) => {
                if(data.result){
                    alert("Change Password Success")
                    window.location.href = 'login.html'
                }
            })
            .catch((error) => {
                console.log("Error: "+error)
            })
    }
}

function checkVal(passsword, repassword){
    let check = true
    pwError.innerText = ''
    rePwError.innerText = ''
    pwError.classList.remove('error-active')
    rePwError.classList.remove('error-active')
    if(passsword.trim() === ''){
        check =false
        pwError.innerText = "Password is required"
        pwError.classList.add('error-active')
    }
    if(repassword.trim() === ''){
        check =false
        rePwError.innerText = "Password is required"
        rePwError.classList.add('error-active')
    }
    if(repassword.trim() === '' && passsword.trim() === ''){
        if (repassword !== password) {
            check = false
            rePwError.innerText = "Password confirm does not match password."
            rePwError.classList.add('error-active')
        }
    }
    return check
}