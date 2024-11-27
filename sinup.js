const passwordreg =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
const emailreg =
    /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
const nickreg = /^(?=.*\s).{0,11}$/;  // 띄어쓰기 포함하는지 검사
const nick11 = /^.{11,}$/;
const elepasswordcheck = document.getElementsByClassName('passwordcheck');
const elenickname = document.getElementsByClassName('nickname');
const elelogin = document.getElementById('login');
let check1 = false;
let check2 = false;
let check3 = false;
let check4 = false;
const emailElements = document.getElementsByClassName('email');
const elepassword = document.getElementsByClassName('password');

function check(check1, check2, check3, check4) {
    if (check1 & check2 & check3 & check4) {
        const styleSheet = document.createElement('style');
        document.head.appendChild(styleSheet);
        styleSheet.sheet.insertRule('button { background-color: #7F6AEE; }', 0);
    }
}

document.getElementById('back').addEventListener('click', () => {
    location.href = 'ex.html';
});
for (let i = 0; i < emailElements.length; i++) {
    emailElements[i].addEventListener('focusout', () => {
        const emailval = emailElements[i].value;

        if (!emailval) {
            document.getElementsByClassName('helper1')[0].innerText =
                '이메일을 입력해 주세요!';
            check1 = false;
        } else if (!emailreg.test(emailval)) {
            document.getElementsByClassName('helper1')[0].innerText =
                '*올바른 이메일 주소를 입력해주세요. (예: example@example.com)';
            check1 = false;
        } else if (emailreg.test(emailval)) {
            document.getElementsByClassName('helper1')[0].innerText = '*';
            check1 = true;
            check(check1, check2, check3, check4);
        }
    });
}

for (let i = 0; i < elepassword.length; i++) {
    elepassword[i].addEventListener('focusout', () => {
        const elepass = elepassword[i].value;

        if (!elepass) {
            document.getElementsByClassName('helper2')[0].innerText =
                '비밀번호를 입력해 주세요!';
            check2 = false;
        } else if (!passwordreg.test(elepass)) {
            document.getElementsByClassName('helper2')[0].innerText =
                '비밀번호는 8자이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
            check2 = false;
        } else if (passwordreg.test(elepass)) {
            document.getElementsByClassName('helper2')[0].innerText = '*';
            check2 = true;
            check(check1, check2, check3, check4);
        }
    });
}

for (let i = 0; i < elepasswordcheck.length; i++) {
    elepasswordcheck[i].addEventListener('focusout', () => {
        const elepasscheck = elepasswordcheck[i].value;
        const elepass = elepassword[i].value;
        if (!elepasscheck) {
            document.getElementsByClassName('helper3')[0].innerText =
                '비밀번호를 한번더 입력해 주세요!';
            check3 = false;
        } else if (elepass != elepasscheck) {
            document.getElementsByClassName('helper3')[0].innerText =
                '비밀번호가 다릅니다.';
            check3 = false;
        } else if (elepass == elepasscheck) {
            document.getElementsByClassName('helper3')[0].innerText =
                '같습니다';
            check3 = true;
            check(check1, check2, check3, check4);
        }
    });
}

for (let i = 0; i < elenickname.length; i++) {
    elenickname[i].addEventListener('focusout', () => {
        const elename = elenickname[i].value;
        if (!elename) {
            document.getElementsByClassName('helper4')[0].innerText =
                '*닉네임을 입력해주세요';
            check4 = false;
        } else if (nickreg.test(elename)) {
            document.getElementsByClassName('helper4')[0].innerText =
                '*띄어쓰기를 제거해주세요';
            check4 = false;
        } else if (nick11.test(elename)) {
            document.getElementsByClassName('helper4')[0].innerText =
                '닉네임은 최대10자 까지 작성 가능합니다.';
            check4 = false;
        } else {
            document.getElementsByClassName('helper4')[0].innerText = '*';
            check4 = true;
            check(check1, check2, check3, check4);
        }
    });
}

document.getElementById('login').addEventListener('click', () => {
    const email = document.getElementsByClassName('email')[0].value;
    const password = elepassword[0].value;
    const nickname = elenickname[0].value;

    const userData = {
        email: email,
        password: password,
        nickname: nickname,
    };

    fetch('http://localhost:3000/saveUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    .then(response => response.json())  // JSON 형식으로 응답 받기
    .then(jsondata => {
        console.log(jsondata);
        if(jsondata.status_num === 1){
            document.getElementsByClassName('helper1')[0].innerText =
                jsondata.invalid_requestError;
            check1 = false;
        }
        if(jsondata.status_num === 2){
            document.getElementsByClassName('helper4')[0].innerText =
                jsondata.invalid_requestError;
            check1 = false;
        }
        if(jsondata.status_num === 3){
            document.getElementsByClassName('helper1')[0].innerText =
                jsondata.invalid_requestError;
            check1 = false;
        }
        if(jsondata.status_num === 4){
            document.getElementsByClassName('helper4')[0].innerText =
                jsondata.invalid_requestError;
            check1 = false;
        }
        if(jsondata.status_num === 5){
            document.getElementsByClassName('helper3')[0].innerText =
                jsondata.invalid_requestError;
            check1 = false;
        }
        if (jsondata.user_id === 1) {
            console.log("회원가입 성공");
            //location.href = `ex.html`;
        }
    })
        .catch(error => {
            console.error('Error:', error);
        });
});
