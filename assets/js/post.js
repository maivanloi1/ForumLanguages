    const $ = document.querySelector.bind(document)
    const $$ = document.querySelectorAll.bind(document)

    const btnUpPost = $('.post-up__btn')

    const apiUpPost = `${api}posts`
    const apiUpImage = `${api}upload/post`

    document.getElementById('post-file__input').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = $('.post-file__img');
                img.src = e.target.result;
                img.style.display = 'block';
                $('.icon').style.display = 'none';
                $('.post-file__label').style.display = 'none'
            };
            reader.readAsDataURL(file);
        }
    })

    btnUpPost.onclick = function () {
        let language = $('select[name="language"]').value
        let title = $('input[name="title"]').value
        let content = $('textarea[name="content"]').value

        callApiUpImage(language,title,content)
    }

    function callApiUpPost(language, title, content, img) {
        let data = {
            language,
            title,
            content,
            img
        }

        let option = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('authToken')
            },
            body: JSON.stringify(data)
        }

        fetch(apiUpPost, option)
            .then((res) => res.json())
            .then((data) => {
                if (data.result) {
                    alert("Up Post Success")
                } else {
                    alert(data.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function callApiUpImage(language,title,content) {
        let resultImage = ""
        let img = document.getElementById('post-file__input').files[0]

        if (img) {
            let formData = new FormData()
            formData.append('file', img)

            let option = {
                method: "POST",
                body: formData
            }

            fetch(apiUpImage, option)
                .then((res) => res.json())
                .then((data) => {
                    if (data.result.valid === true) {
                        resultImage = data.result.link
                        callApiUpPost(language,title,content,resultImage)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }