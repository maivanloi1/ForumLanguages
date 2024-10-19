document.getElementById('post-file__input').addEventListener('change', function (event) {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = function (e) {
            const img = document.getElementById('post-file__img')
            img.src = e.target.result
            img.style.display = 'block'
            document.querySelector('.icon').style.display = 'none'
        }
        reader.readAsDataURL(file)
    }
})