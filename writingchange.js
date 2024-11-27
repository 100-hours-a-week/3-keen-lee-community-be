const urlParams = new URLSearchParams(window.location.search);
const dialogId = urlParams.get('id');
fetch(`http://localhost:3000/users/writingchange/${dialogId}`)
    .then(response => response.text())
    .then(data => {
        const jsondata = JSON.parse(data);
        console.log(jsondata);
   

const nick11 = /.{26,}/;

document.getElementById('back').addEventListener('click', () => {
    //뒤로가기
    location.href = `writingpage.html?id=${dialogId}`;
});
document.getElementById('enter').addEventListener('click', () => {
    //개시글 수정버튼
    fetch(`http://localhost:3000/users/writingchange/${dialogId}`, {
        method : "PATCH",
        headers : {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            title: document.getElementById('title1').value,
            content: document.getElementById('content').value
          })
    })
    .then(response => {
        if(!response.ok){
            throw new Error("네트워크 응답이 올바르지 않습니다.")
        }
        return response.json();
    })
    .then(data => {
        console.log(data)
    })
    .catch((error) => console.log(error))
    
    location.href = `writingpage.html?id=${dialogId}`;
});
document.getElementById('title1').value = jsondata.title; //제목 JSON에서 가져와야함

document.getElementById('title1').addEventListener('input', () => {
    if (nick11.test(document.getElementById('title1').value)) {
        document.getElementById('title1').value = document
            .getElementById('title1')
            .value.substring(0, 26);
        alert('최대26글자까지 입력가능합니다.');
    }
});

document.getElementById('content').value =jsondata.content;
})
.catch(error => {
    console.error('Error:', error);
});