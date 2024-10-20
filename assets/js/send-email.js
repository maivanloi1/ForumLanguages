const pre = document.referrer
const pageName = pre.substring(pre.lastIndexOf('/') + 1);
const titleSend = document.querySelector('.content-header__title')
if(pageName==="forgot-password.html"){
    titleSend.innerText = "Please check your email to reset your password. If you do not receive the email, please check your spam folder."
}else if(pageName==="active-account.html"){
    titleSend.innerText = "Please check your email to activate your account. If you do not receive the email, please check your spam folder."
}
