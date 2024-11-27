const urlParams = new URLSearchParams(window.location.search);
const dialogId = urlParams.get('id');
const urlnick = urlParams.get('nickname');
fetch(`http://localhost:3000/users/writingpage/${dialogId}`)
	.then((response) => {
        if(!response.ok){
            throw new Error("네트워크 응답이 올바르지 않습니다.")
        }
        return response.json();
    })
	.then((json) => {
        console.log(json)

        const good = document.getElementById('good');
        const show = document.getElementById('show');
        const cmtnum = document.getElementById('cmtnum');
        const input = document.getElementById('inputbox');
        const userid = document.getElementsByClassName('userid');
        const date = document.getElementsByClassName('date');
        const image = document.getElementsByClassName('img2');
        const img3 = document.getElementsByClassName('img3');
        const content = document.getElementsByClassName('content');
        const nickname = document.getElementsByClassName('nickname');
        const textmin = document.getElementsByClassName('textmin');
        const date2 = document.getElementsByClassName('date2');
        const title = document.getElementsByClassName('bodytitle');
        
        function a(q, js) {
            if (Number(js) >= 1000) {
                const a = parseInt(Number(js) / 1000);
                q.textContent = `${a}K`;
            }
            else{
                q.textContent = js;
            }
        }
        
        function ch(q, js){
            q.textContent = js;
        }


        ch(title.item(0) ,json.title.slice(0, 26));
        ch(userid.item(0), json.id); //게시글 작성자 아이디
        ch(date.item(0), json.createdate); //게시글 작성일자
        image.item(0).src = json.image; //게시글 작성자 프로필 사진
        img3.item(0).src = json.contentimg;
        content.item(0).innerHTML = json.content.replace(/\n/g, "<br>");
       
       
        for(let i = 0; i<json.cmt.length;i++){
            nickname.item(i).textContent=json.cmt[i].id;
            textmin.item(i).textContent=json.cmt[i].cmt;
            date2.item(i).textContent=json.cmt[i].date;
        }


        document.getElementById('back').addEventListener('click', () => {
            //뒤로가기
            location.href = `dialog.html?id=${urlnick}`;
        });
        document.getElementById('fix').addEventListener('click', () => {
            //개시글 수정버튼
            location.href = `writingchange.html?id=${dialogId}`;
        });

        document.getElementById('del').addEventListener('click', () => {
            //개시글 삭제버튼
            document.getElementById('delcontent').style.display = 'inline-block';
        });
        document.getElementById('delcommentbutton').addEventListener('click', () => {
            //댓글 삭제버튼
            document.getElementById('delcomment').style.display = 'inline-block';
        });
        document.getElementById('fixcommentbutton').addEventListener('click', () => {
            //댓글 수정버튼
            input.value = document.getElementById('textcmt').textContent;
            document.getElementById('cmtbutton').textContent = '댓글 수정';
            const nick = document.getElementsByClassName('nickname').item(0).textContent; //  TODO : 로그인한 아이디 닉네임으로 바꿔야함
            fetch(`http://localhost:3000/users/writingpage/${dialogId}/${nick}`, {method : 'GET'})// TODO :로그인 한 id로 받아야함
            .then((response) => {
                if(!response.ok){
                    throw new Error("네트워크 응답이 올바르지 않습니다.")
                }
                return response.json();
            })
            .then((json) => {
                console.log(json)
            })
            .catch((error) => console.log(error))
        });

        document.getElementById('cmtbutton').addEventListener('click', () => {
            const style = document.createElement('style');
            document.head.appendChild(style);
            if (document.getElementById('cmtbutton').textContent == '댓글 수정') {
                const nick = document.getElementsByClassName('nickname').item(0).textContent; //  TODO : 로그인한 아이디 닉네임으로 바꿔야함
                fetch(`http://localhost:3000/users/writingpage/${dialogId}/${nick}`, {
                    method : 'PATCH',
                    headers : {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        "id": nick,
                        "cmt": input.value,
                        "date": "2024-11-21 16:47:03"
                      })
            })// TODO :로그인 한 id로 받아야함
            .then((response) => {
                if(!response.ok){
                    throw new Error("네트워크 응답이 올바르지 않습니다.")
                }
                return response.json();
            })
            .then((json) => {
                console.log(json)
            })
            .catch((error) => console.log(error))
                document.getElementById('cmtbutton').textContent = '댓글 등록';
                input.value = '';
            }
            style.sheet.insertRule('#cmtbutton { background-color: #ACA0EB}', 0);
            if(input.value != ''){
                fetch(`http://localhost:3000/users/writingpage/comment/${dialogId}`, {
                    method : 'PUT',
                    headers : {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        "id": urlnick,
                        "cmt": input.value,
                        "date": "2024-11-21 16:47:03"
                      } )
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('서버 요청 실패');
                    }
                    return response.text();
                })
                .then(data => {
                    console.log('삭제 성공:', data);
                    // 삭제가 성공적으로 처리되면 페이지 리디렉션
                    location.href = `dialog.html?id=${urlnick}`;
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            } //TODO: 댓글 추가 나중에 DB에 넣어야됌
        });

        document.getElementById('modalbutton1').addEventListener('click', () => {
            //개시글삭제모달창 취소버튼
            document.getElementById('delcontent').style.display = 'none';
        });
        document.getElementById('modalbutton3').addEventListener('click', () => {
            //댓글모달창 취소버튼
            document.getElementById('delcomment').style.display = 'none';
        });

        document.getElementById('modalbutton2').addEventListener('click', () => {
            // 게시글 삭제 모달창 확인 버튼 클릭 시
            fetch(`http://localhost:3000/users/writingpage/${dialogId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                // JSON.stringify()를 사용하여 데이터를 직렬화하고,
                // 반환된 JSON 문자열을 body로 전송
                body: JSON.stringify({ reson : '삭제버튼 클릭' })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('서버 요청 실패');
                }
                return response.text();
            })
            .then(data => {
                console.log('삭제 성공:', data);
                // 삭제가 성공적으로 처리되면 페이지 리디렉션
                location.href = `dialog.html?id=${urlnick}`;
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
        document.getElementById('modalbutton4').addEventListener('click', () => {
            //댓글모달창 확인버튼
            document.getElementById('delcontent').style.display = 'none';
        });

        a(good, json.good);
        a(show, json.comment); //개시글 좋아요,댓글,조회수
        a(cmtnum, json.views);

        document.getElementById('inputbox').addEventListener('input', () => {
            //댓글 버튼 색상변경
            const style = document.createElement('style');
            document.head.appendChild(style);
            if (document.getElementById('inputbox').value) {
                style.sheet.insertRule('#cmtbutton { background-color: #7F6AEE }', 0);
            }
            style.sheet.insertRule('#cmtbutton { background-color: #ACA0EB}', 0);
        });
    })
    .catch((error) => console.log(error))