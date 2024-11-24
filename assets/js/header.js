const token = localStorage.getItem('authToken')

if(!token){
    $('.header-create__link').style.display='none';
    $('.header-notify').style.display='none';
}