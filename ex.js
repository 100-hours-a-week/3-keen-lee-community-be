const passwordreg =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
const emailreg =
    /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

function getemail() {
    const email = document.getElementById('email').value;
    return emailreg.test(email);
}
function getpss() {
    const password = document.getElementById('password').value;
    return passwordreg.test(password);
}
document.getElementById('email').addEventListener('focusout', () => {
    if (getemail() & getpss()) {
        const styleSheet = document.createElement('style');
        document.head.appendChild(styleSheet);
        styleSheet.sheet.insertRule('button { background-color: #7F6AEE; }', 0);
    }
    else{
        const styleSheet = document.createElement('style');
        document.head.appendChild(styleSheet);
        styleSheet.sheet.insertRule('button { background-color: #ACA0EB; }', 0);
    }
});

document.getElementById('password').addEventListener('focusout', () => {
    if (getemail() & getpss()) {
        const styleSheet = document.createElement('style');
        document.head.appendChild(styleSheet);
        styleSheet.sheet.insertRule('button { background-color: #7F6AEE; }', 0);
    }
    else{
        const styleSheet = document.createElement('style');
        document.head.appendChild(styleSheet);
        styleSheet.sheet.insertRule('button { background-color: #ACA0EB; }', 0);
    }
});

document.getElementById('login').addEventListener('click', () => {
    // alert('요소가 클릭되었습니다!');
    if (!getemail()) {
        alert('*올바른 이메일 주소를 입력해주세요. (예: example@example.com)');
    }
    if (!getpss()) {
        alert(
            '비밀번호는 8자이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.',
        );
    }

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const userData = {
        email: email,
        password: password
    };
    fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
        .then(response => response.text())
        .then(data => {
            const jsondata = JSON.parse(data);
            console.log(jsondata)
            if(jsondata.user_id===1){
                console.log("로그인성공");
                location.href = `dialog.html?id=${jsondata.nickname}`;
            }
                
        })
        .catch(error => {
            console.error('Error:', error);
        });
    //location.href = 'dialog.html';
});

document.getElementById('signup').addEventListener('click', () => {
    location.href = 'sinup.html';
});

/*
    fetch('https://jsonplaceholder.typicode.com/posts/1')
	// 데이터를 JSON 형태로 변환
  .then(response => response.json())
*/


