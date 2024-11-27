const urlParams = new URLSearchParams(window.location.search);
const nick = urlParams.get('id');
fetch("http://localhost:3000/users/dialog")
	.then((response) => {
        if(!response.ok){
            throw new Error("네트워크 응답이 올바르지 않습니다.")
        }
        return response.json();
    })
	.then((json) => {
        const nick11 = /.{26,}/;
        document.getElementById('button').addEventListener('click', () => {
            location.href = `adddialog.html?id=${nick}`; //로그인한 회원 닉네임
        });
        document.getElementById('button').addEventListener('mouseover', () => {
            const style = document.createElement('style');
            document.head.appendChild(style);
            style.sheet.insertRule('.button { background-color: #7F6AEE }', 0);
        });
        
        document.querySelector('button').addEventListener('mouseout', () => {
            const style = document.createElement('style');
            document.head.appendChild(style);
            style.sheet.insertRule('.button { background-color: #ACA0EB}', 0);
        });








        function colorcg(item) {
            document.getElementById(`${item}`).addEventListener('mouseover', () => {
                const style = document.createElement('style');
                document.head.appendChild(style);
                style.sheet.insertRule(`#${item} { background-color: #E9E9E9 }`, 0);
            });
        
            document.getElementById(`${item}`).addEventListener('mouseout', () => {
                const style = document.createElement('style');
                document.head.appendChild(style);
                style.sheet.insertRule(`#${item} { background-color: #d9d9d9}`, 0);
            });
        }
        
        document.getElementById('img1').addEventListener('click', () => {
            if (document.getElementById('felx2').style.display === 'none') {
                document.getElementById('felx2').style.display = 'flex';
            } else {
                document.getElementById('felx2').style.display = 'none';
            }
        });
        colorcg('item1');
        colorcg('item2');
        colorcg('item3');

        document.getElementById('item1').addEventListener('click', () => {
            location.href = `infochange.html?id=${nick}`;
        });
        
        document.getElementById('item2').addEventListener('click', () => {
            location.href = `passwordcange.html?id=${nick}`;
        });
        
        document.getElementById('item3').addEventListener('click', () => {
            location.href = `ex.html`;
        });

        
        
        const titlelen = document.getElementsByClassName('minititle');
        const goodnum = document.getElementsByClassName('good');
        const commentnum = document.getElementsByClassName('comment');
        const viewsnum = document.getElementsByClassName('views');
        const nickname = document.getElementsByClassName('nickname');
        const date = document.getElementsByClassName('date');
        const image = document.getElementsByClassName('img2');
        const writingpage = document.getElementsByClassName('ex1');
        //제목 json에서 불러오기
        for (let i = 0; i < json.length; i++) {
            const titlelen1 = json[i].title;
            if (nick11.test(titlelen1)) {
                titlelen.item(i).textContent = titlelen1.slice(0, 26);
            }


            //좋아요 수 json에서 불러오기
            const good = json[i].good;
            if (Number(good) >= 1000) {
                goodnum.item(i).textContent = `${"좋아요 " + parseInt(Number(good) / 1000)}K`;
            }else {
                goodnum.item(i).textContent = `좋아요 ${good}`;
            }

            //댓글 수 json에서 불러오기
            const comment = json[i].comment; //json[i].cmt.length;
            if (Number(comment) >= 1000) {
                commentnum.item(i).textContent = `${"댓글 " + parseInt(Number(comment) / 1000)}K`;
            }
            else{
                commentnum.item(i).textContent = `댓글 ${comment}`
            }



            //조회 수 json에서 불러오기
            const views = json[i].views;
            if (Number(views) >= 1000) {
                viewsnum.item(i).textContent = `${"조회수 " + parseInt(Number(views) / 1000)}K`;
            }
            else{
                viewsnum.item(i).textContent = `${"조회수 " + parseInt(Number(views))}`;
            }

            //닉네임 JSON에서 불러오기
            nickname.item(i).textContent = json[i].id;
            
            //날짜 JSON에서 불러오기
            date.item(i).textContent = json[i].createdate;

            image.item(i).src = json[i].image;

            const userData = {
                id: i
            };
            writingpage.item(i).addEventListener('click', () => {
                //location.href = 'writingpage.html';
                const dialogId = json.item(i).id;  // 클릭된 아이템의 id 가져오기
                fetch(`http://localhost:3000/users/writingpage/${dialogId}`)
                    .then((response) => response.json())
                    .then((data) => {
                        // 응답받은 데이터 처리 (예: 페이지 이동, 데이터 표시 등)
                        console.log(data); // 여기서 데이터에 대해 원하는 처리를 할 수 있습니다.
                        location.href = `writingpage.html?id=${dialogId}&nickname=${nick}`;
                    })
                    .catch((error) => console.log("Error:", error));
            });
        }
        
        
        /*
        for (let i = 0; i < json.length; i++) {
            const good = json[i].good;
            console.log(good, i);
            if (Number(good) >= 1000) {
                const a = Number(good) / 1000;
                goodnum[i].textContent = `${"좋아요 " + parseInt(a, 10)}K`;
            }
            
            if (Number(good.textContent.slice(4)) >= 1000) {
                const a = parseInt(Number(good.textContent.slice(4)), 10) / 1000;
                good.textContent = `${good.textContent.slice(0, 4) + parseInt(a, 10)}K`;
            }
                
        }
            */
        /*
        const commentnum = document.getElementsByClassName('comment');
        for (let i = 0; i < commentnum.length; i++) {
            const comment = commentnum.item(i);
            console.log(comment.textContent);
            if (Number(comment.textContent.slice(3)) >= 1000) {
                const a = parseInt(Number(comment.textContent.slice(3)), 10) / 1000;
                comment.textContent = `${comment.textContent.slice(0, 3) + parseInt(a, 10)}K`;
            }
        }
        */
        /*
        const viewsnum = document.getElementsByClassName('views');
        for (let i = 0; i < viewsnum.length; i++) {
            const views = viewsnum.item(i);
            console.log(views.textContent);
            if (Number(views.textContent.slice(4)) >= 1000) {
                const a = parseInt(Number(views.textContent.slice(4)), 10) / 1000;
                views.textContent = `${views.textContent.slice(0, 4) + parseInt(a, 10)}K`;
            }
        }
        */
       /*
        document.getElementsByClassName('ex1').addEventListener('click', () => {
            location.href = 'writingpage.html';
        });
        const writingpage = document.getElementsByClassName('ex1');
        for (let i = 0; i < writingpage.length; i++) {
            writingpage.item(i).addEventListener('click', () => {
                location.href = 'writingpage.html';
            });
        }
            */
    })
	.catch((error) => console.log(error))