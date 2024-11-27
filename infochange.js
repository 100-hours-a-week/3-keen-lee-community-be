const urlParams = new URLSearchParams(window.location.search);
const dialogId = urlParams.get('id');
console.log(dialogId);

fetch(`http://localhost:3000/users/infochange/${dialogId}`)
    .then((response) => {
        console.log(response)
        if (!response.ok) {
            throw new Error("네트워크 응답이 올바르지 않습니다.");
        }
        return response.json();
    })
    .then((json) => {
        console.log(json);
        document.getElementsByClassName('emailtext').item(0).textContent = json.email;
        //document.getElementsByClassName('img2').item(0).textContent = json.email; //TODO 나중에 이미지 추가시에 추가
        // 정규식: 닉네임 검증
        const nickreg = /^(?=.*\s).{0,11}$/;  // 띄어쓰기 포함하는지 검사
        const nick11 = /^.{11,}$/;           // 11자 이상 검사

        function colorcg(item) {
            const element = document.getElementById(item);
            if (element) {
                element.addEventListener('mouseover', () => {
                    const style = document.createElement('style');
                    document.head.appendChild(style);
                    style.sheet.insertRule(`#${item} { background-color: #E9E9E9 }`, 0);
                });

                element.addEventListener('mouseout', () => {
                    const style = document.createElement('style');
                    document.head.appendChild(style);
                    style.sheet.insertRule(`#${item} { background-color: #d9d9d9}`, 0);
                });
            }
        }

        const img1 = document.getElementById('img1');
        if (img1) {
            img1.addEventListener('click', () => {
                const flex2 = document.getElementById('felx2');
                if (flex2) {
                    if (flex2.style.display !== 'none') {
                        flex2.style.display = 'none';
                    } else {
                        flex2.style.display = 'flex';
                    }
                }
            });
        }

        // 색상 변경
        colorcg('item1');
        colorcg('item2');
        colorcg('item3');

        // 닉네임 유효성 검사
        document.getElementById('button').addEventListener('click', () => {
            const elename = document.getElementById('inputbox').value;
            
            fetch(`http://localhost:3000/users/infochange/button/${dialogId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({nickname: elename}),
            })
            .then(response => response.json())  // JSON 형식으로 응답 받기
            .then(async jsondata => {
                console.log(jsondata);
                if (jsondata.user_id === 1) {
                    console.log("닉네임변경 성공");
                    {
                        document.getElementsByClassName('helper')[0].innerText = '';
                        document.getElementById('button1').classList.add('active');
                         setTimeout(() => {
                            document.getElementById('button1').classList.remove('active');
                        }, 2000);
                    }
                    location.href = `dialog.html?id=${elename}`;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
            
            if (!elename) {
                document.getElementsByClassName('helper')[0].innerText = '*닉네임을 입력해주세요';
            } else if (nickreg.test(elename)) {
                document.getElementsByClassName('helper')[0].innerText = '*띄어쓰기를 없애주세요';
            } else if (nick11.test(elename)) {
                document.getElementsByClassName('helper')[0].innerText = '닉네임은 최대10자 까지 작성 가능합니다.';
            } else if(elename === json.nickname){
                document.getElementsByClassName('helper')[0].innerText = '변경전 닉네임과 같습니다.';
            }
            /*
             else {
                document.getElementsByClassName('helper')[0].innerText = '';
                document.getElementById('button1').classList.add('active');
                setTimeout(() => {
                    document.getElementById('button1').classList.remove('active');  //변경 성공시 띄우기
                }, 1000);
            }
                */
        });

        // 회원 탈퇴 모달
        document.getElementById('userout').addEventListener('click', () => {
            document.getElementById('delcomment').style.display = 'inline-block';
        });

        document.getElementById('modalbutton3').addEventListener('click', () => {
            document.getElementById('delcomment').style.display = 'none';
        });

        document.getElementById('modalbutton4').addEventListener('click', () => {
            fetch(`http://localhost:3000/users/infochange/${dialogId}`, {
                method : "DELETE",
            headers :{'Content-Type' : 'application/json',
            },
            body : JSON.stringify({email : json.email}),
            })
            .then(response => response.json())  // JSON 형식으로 응답 받기
            .then(jsondata => {
                if(jsondata.user_id === 1){
                    location.href = 'ex.html';
                    alert('탈퇴되었습니다!');
                    
                }
                
            })
            .catch(error => {
                console.error('Error:', error);
            });   
        });

        // 메뉴 클릭 시 페이지 이동
        document.getElementById('item1').addEventListener('click', () => {
            location.href = `infochange.html?id=${dialogId}`;
        });

        document.getElementById('item2').addEventListener('click', () => {
            location.href = `passwordcange.html?id=${dialogId}`;
        });

        document.getElementById('item3').addEventListener('click', () => {
            location.href = 'ex.html';
        });
    })
    .catch((error) => {
        console.log(error);
    });
