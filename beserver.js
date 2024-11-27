const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

const emailreg =
    /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
const nickreg = /^(?=.*\s).{0,10}$/;  // 띄어쓰기 포함하는지 검사
const nick11 = /^.{11,}$/;
const passwordreg =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,20}$/;
app.use(express.json());
app.use(cors({ origin: 'http://127.0.0.1:5500' }));

// 'Users.json' 파일의 경로 설정
const filePath = path.join(__dirname, 'Users.json');
const dialogPath = path.join(__dirname, 'dialoglist.json');
// POST 요청을 처리하는 라우터
app.post('/saveUser', async (req, res) => {
    const userData = req.body; // 클라이언트에서 보내는 데이터
    const { email, password, nickname } = userData; // 이메일, 비밀번호, 닉네임을 분리
    
    try {
        let users = [];

        // 파일이 존재하면 기존 데이터 읽어오기, 없으면 빈 배열 초기화
        if (fs.existsSync(filePath)) {
            const fileContent = await fs.promises.readFile(filePath, 'utf8');
            users = JSON.parse(fileContent);

            // users가 배열인지 확인, 배열이 아니라면 빈 배열로 초기화
            if (!Array.isArray(users)) {
                console.log('users는 배열이 아닙니다. 빈 배열로 초기화합니다.');
                users = [];
            }
        }
        
        // 이메일과 닉네임 중복 체크
        const emailExists = users.some(user => user.email === email);
        const nicknameExists = users.some(user => user.nickname === nickname);

        // 이메일과 닉네임 유효성 체크
        const emaileff = email && emailreg.test(email);
        const nicknameeff = nickname && !nickreg.test(nickname) && !nick11.test(nickname);
        const passwordff = passwordreg.test(password)
        // 이메일 검증
        if (!emaileff) {
                return res.status(401).json({'invalid_requestError': '이메일형식이 아닙니다.' ,'status_num' : 1});
        }

        // 닉네임 검증
        if (!nicknameeff) {
            return res.status(401).json({'invalid_requestError': '닉네임형식이 틀립니다.','status_num' : 2});
        }

        // 중복 이메일 및 닉네임 검증
        if (emailExists) {
            return res.status(401).json({'invalid_requestError': '중복된 이메일입니다.','status_num' : 3});
        }

        if (nicknameExists) {
            return res.status(401).json({'invalid_requestError': '중복된 닉네임입니다.','status_num' : 4});
        }
        if (!passwordff) {
            return res.status(401).json({'invalid_requestError': '비밀번호 형식에 맞춰주세요.','status_num' : 5});
        }
        if(!emailExists&&!nicknameExists&&emaileff&&nicknameeff){


        const newUser = {
            email : email, 
            password: password,
            nickname : nickname
        };

        // 배열에 새 사용자 추가
        users.push(newUser);

        // 배열을 다시 JSON 형식으로 변환하여 파일에 저장
        await fs.promises.writeFile(
            filePath,
            JSON.stringify(users, null, 2),
            'utf8',
        );
        return res.status(200).json({"message": "닉네임 수정 성공!", "user_id": 1});
    }
    } catch (error) {
        console.error('파일 처리 중 오류 발생:', error.message); // 에러 메시지만 출력
        res.status(500).send('internal_server_error');
    }
});

app.post('/users/login', async (req, res) => {
    const userData = req.body;
    const { email, password } = userData;
    
    try {
        let users = [];
        
        // Users.json 파일이 있으면 기존 사용자 데이터 불러오기
        if (fs.existsSync(filePath)) {
            const fileContent = await fs.promises.readFile(filePath, 'utf8');
            users = JSON.parse(fileContent);
        }

        // 이메일과 비밀번호 일치 여부 확인
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            // 로그인 성공시 json 형식으로 응답 보내기
            return res.status(200).json({"message": "로그인 성공!", "user_id": 1, "nickname" : user.nickname});
        } else {
            // 이메일 또는 비밀번호가 일치하지 않음
            return res.status(400).json({'error': 'invalid_request', 'message': '이메일 또는 비밀번호가 일치하지 않습니다.'});
        }
    } catch (error) {
        console.error('파일 처리 중 오류 발생:', error.message); // 에러 메시지만 출력
        return res.status(500).json({'error': 'internal_server_error', 'message': '서버 오류 발생'});
    }
});


app.get('/users/dialog', async(req, res) => {
    // dialogPath가 배열이므로 직접 전달
    let dialog = [];
    dialog = await fs.promises.readFile(dialogPath, 'utf8');
    //console.log(JSON.stringify(dialog));
    res.send(dialog);
});

app.post('/users/adddialog/:nickname', async (req, res) => {
    const userNickname = req.params.nickname;  // URL에서 닉네임을 추출
    const userData = req.body;  // 클라이언트에서 보낸 JSON 데이터를 받음

    try {
        // 기존 다이얼로그 파일 읽기
        const dialog = await fs.promises.readFile(dialogPath, 'utf8');
        const dialogData = JSON.parse(dialog);  // JSON을 JavaScript 객체로 변환
        if(userData.title.length>=27){
        userData.title=userData.title.slice(0, 26);
        }
        // 새로운 게시글 생성
        const newDialog = {
            title: userData.title,
            content: userData.content,
            good: 0,
            comment: 0,
            views: 0,
            createdate: userData.createdate,
            image: userData.image || "",  // 기본 이미지 경로 또는 사용자가 보낸 이미지 경로
            id: userNickname,  // 게시글 작성자의 닉네임
        };

        // 새 게시글을 dialogData 배열에 추가
        dialogData.push(newDialog);

        // 수정된 데이터를 JSON 형식으로 파일에 저장
        await fs.promises.writeFile(dialogPath, JSON.stringify(dialogData, null, 2), 'utf8');
        
        return res.status(201).json({"message": "개시 성공"});
    }catch (error) {
        console.error('파일 처리 중 오류 발생:', error.message);
        res.status(500).json({
            message: '게시글을 추가하는 데 오류가 발생했습니다.',
            error: error.message
        });
    }

});

app.get('/users/writingpage/:id', async (req, res) => {
    const dialogId = req.params.id;
    try {
        const dialog = await fs.promises.readFile(dialogPath, 'utf8');
        const dialogData = JSON.parse(dialog);

        // ID에 해당하는 대화 데이터 찾기
        const dialogItem = dialogData.find(item => item.id === dialogId);

        if (dialogItem) {
            res.json(dialogItem); // 해당 ID의 대화 내용 응답
        } 
        else {
            res.status(404).json({ message: '댓글 내용이 없습니다.' });
        }
    } catch (error) {
        console.error('파일 처리 중 오류 발생:', error.message);
        res.status(500).send('internal_server_error');
    }
});

app.get('/users/writingpage/:id/:nick', async (req, res) => {
    const dialogId = req.params.id;
    const nick = req.params.nick;
    try {
        const dialog = await fs.promises.readFile(dialogPath, 'utf8');
        const dialogData = JSON.parse(dialog);
        console.log(dialogId, nick);

        const dialogItem = dialogData.find(item => item.id === dialogId);
        const dialogItem2 = dialogItem.cmt.find(item => item.id === nick);
        if (dialogItem2) {
            res.json(dialogItem2.cmt);
        } 
        else {
            res.status(404).json({ message: '댓글 내용이 없습니다.' });
        }
    } catch (error) {
        console.error('파일 처리 중 오류 발생:', error.message);
        res.status(500).end('internal_server_error');
    }
});

app.patch('/users/writingpage/:id/:nick', async (req, res) => {
    const dialogId = req.params.id;  // URL에서 dialogId 추출
    const nick = req.params.nick;    // URL에서 nick 추출
    const userData = req.body;       // 클라이언트에서 보낸 데이터 (댓글 내용)

    try {
        // JSON 파일 읽기
        const dialog = await fs.promises.readFile(dialogPath, 'utf8');
        const dialogData = JSON.parse(dialog);

        // 필요한 데이터 추출
        const { id, cmt, date } = userData;

        console.log(`Dialog ID: ${dialogId}, Nick: ${nick}`);
        
        // dialogData에서 dialogId에 해당하는 항목을 찾기
        const dialogItem = dialogData.find(item => item.id === dialogId);

        if (!dialogItem) {
            return res.status(404).json({ message: '해당 ID의 게시물이 존재하지 않습니다.' });
        }

        // dialogItem.cmt에서 해당 닉네임에 해당하는 댓글 찾기
        const dialogItem2 = dialogItem.cmt.find(item => item.id === nick);

        if (!dialogItem2) {
            return res.status(404).json({ message: '해당 닉네임의 댓글이 존재하지 않습니다.' });
        }

        // 댓글을 업데이트
        dialogItem2.cmt = cmt;  // 기존 댓글을 새 댓글로 교체
        dialogItem2.date = date;  // 댓글 수정 날짜 업데이트

        // 수정된 데이터를 JSON 파일에 저장
        await fs.promises.writeFile(dialogPath, JSON.stringify(dialogData, null, 2), 'utf8');

        // 성공적으로 댓글을 수정한 후, 수정된 댓글을 응답으로 반환
        res.status(200).json({
            message: '댓글이 성공적으로 수정되었습니다.',
            updatedComment: dialogItem2
        });
    } catch (error) {
        console.error('파일 처리 중 오류 발생:', error.message);
        res.status(500).send('internal_server_error');
    }
});


app.delete('/users/writingpage/:id', async (req, res) => {
    const resourceId = req.params.id; // URL 경로에서 ID 추출
    const reason = req.body.reason;   // 요청 본문에서 사유 추출
    console.log(`삭제 요청 ID: ${resourceId}, 사유: ${reason}`);

    try {
        // JSON 파일을 비동기적으로 읽기
        const dialog = await fs.promises.readFile(dialogPath, 'utf8');
        const dialogData = JSON.parse(dialog);
        console.log(dialogData, "dialogData");

        // 삭제할 항목 찾기
        const dialogItemIndex = dialogData.findIndex(item => item.id === resourceId);
        
        if (dialogItemIndex === -1) {
            return res.status(404).json({ message: `Resource with ID ${resourceId} not found.` });
        }

        // 삭제할 항목을 배열에서 제거
        dialogData.splice(dialogItemIndex, 1);

        // 삭제 후 수정된 데이터를 JSON 파일에 다시 저장
        await fs.promises.writeFile(dialogPath, JSON.stringify(dialogData, null, 2), 'utf8');
        console.log(`Resource ${resourceId} successfully deleted`);

        // 응답
        res.status(200).json({
            message: `Resource ${resourceId} successfully deleted`,
        });
    } catch (error) {
        console.error('Error deleting resource:', error);
        res.status(500).json({
            message: 'Failed to delete resource',
            error: error.message,
        });
    }
});
// app.delete('/users/writingpage/:id', async (req,res) => {
//     const resourceId = req.params.id; // URL 경로에서 ID 추출
//     const reason = req.body.reason;
//     console.log(`삭제 요청 ID: ${resourceId}, 사유: ${reason}`);
//     const dialog = await fs.promises.readFile(dialogPath, 'utf8');
//         const dialogData = JSON.parse(dialog);
//         console.log(dialog ,"dialog");
//         const dialogItem = dialogData.find(item => item.id === resourceId);
//         console.log(dialogItem);

//     // 삭제 성공했다고 가정하고 응답
//     res.status(200).json({
//         message: `Resource ${resourceId} successfully deleted`,
//     });
// });
app.put('/users/writingpage/comment/:id', async (req, res) => {
    const resourceId = req.params.id; // URL 경로에서 ID 추출
    const { id, cmt, date } = req.body; // 요청 본문에서 댓글 데이터 추출

    try {
        // JSON 파일을 비동기적으로 읽기
        const dialog = await fs.promises.readFile(dialogPath, 'utf8');
        const dialogData = JSON.parse(dialog);

        // resourceId에 해당하는 항목 찾기
        const dialogItem = dialogData.find(item => item.id === resourceId);

        // 항목이 존재하지 않으면 404 에러 반환
        if (!dialogItem) {
            return res.status(404).json({ message: `Resource with ID ${resourceId} not found.` });
        }

        // 댓글을 추가하거나 수정 (예시로 'cmt' 배열에 추가)
        dialogItem.cmt = dialogItem.cmt || [];  // 'comments' 필드가 없으면 빈 배열로 초기화
        dialogItem.cmt.push({ id, cmt, date });  // 새로운 댓글을 추가

        // 수정된 데이터를 JSON 파일에 다시 저장
        await fs.promises.writeFile(dialogPath, JSON.stringify(dialogData, null, 2), 'utf8');

        // 성공적인 응답
        res.status(200).json({
            message: `Comment successfully added/updated for resource ${resourceId}`,
        });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({
            message: 'Failed to update comment',
            error: error.message,
        });
    }
});


app.get('/users/writingchange/:id', async(req, res) => {
    const dialogId = req.params.id;

    try {
        const dialog = await fs.promises.readFile(dialogPath, 'utf8');
        const dialogData = JSON.parse(dialog);
        console.log(dialogId);

        const dialogItem = dialogData.find(item => item.id === dialogId);
        if (dialogItem) {
            res.json(dialogItem);
        } 
        else {
            res.status(404).json({ message: '댓글 내용이 없습니다.' });
        }
    } catch (error) {
        console.error('파일 처리 중 오류 발생:', error.message);
        res.status(500).send('internal_server_error');
    }
});

app.patch('/users/writingchange/:id', async (req, res) => {
    const dialogId = req.params.id;
    const {title, content} = req.body;
    try {
        const dialog = await fs.promises.readFile(dialogPath, 'utf8');
        const dialogData = JSON.parse(dialog);

        const dialogItem = dialogData.find(item => item.id === dialogId);
        if (dialogItem) {
            dialogItem.title = title;
            dialogItem.content = content;
            await fs.promises.writeFile(dialogPath, JSON.stringify(dialogData, null, 2), 'utf8');
            res.status(200).json({message : '수정 성공'});
        } 
        else {
            res.status(404).json({ message: '댓글 내용이 없습니다.' });
        }
    } catch (error) {
        console.error('파일 처리 중 오류 발생:', error.message);
        res.status(500).send('internal_server_error');
    }
})

app.get('/users/infochange/:id', async (req, res) => {
    const dialogId = req.params.id; // URL 파라미터에서 id 추출

    try {
        const dialog = await fs.promises.readFile(filePath, 'utf8'); // 파일 내용 읽기
        const dialogData = JSON.parse(dialog); // JSON 형식 파싱

        // 닉네임에 해당하는 사용자 찾기
        const dialogItem = dialogData.findIndex(item => item.nickname === dialogId);
        if (dialogItem) {
            // 사용자 정보를 반환
            res.status(200).json({ email: dialogData[dialogItem].email, nickname: dialogData[dialogItem].nickname });
        } else {
            // 닉네임이 존재하지 않으면 404 에러 반환
            res.status(404).json({ message: '닉네임이 없습니다.' });
        }
    } catch (error) {
        // 파일 읽기 중 에러 처리
        console.error('파일 처리 중 오류 발생:', error.message);
        res.status(500).send('internal_server_error');
    }
});



app.post(`/users/infochange/button/:id`, async (req, res) => {
    const dialogId = req.params.id;
    console.log(dialogId); 
    try {
        let users = [];
        
        // Users.json 파일이 있으면 기존 사용자 데이터 불러오기
        if (fs.existsSync(filePath)) {
            const fileContent = await fs.promises.readFile(filePath, 'utf8');
            users = JSON.parse(fileContent);
        }

        // 이메일과 비밀번호 일치 여부 확인
        const user = users.find(user => user.nickname === dialogId);
        if(dialogId===req.body.nickname){
            return res.status(401).json({'error': '기존 닉네임과 동일합니다.'});
        } else if(users.find(user => user.nickname === req.body.nickname)){
            return res.status(401).json({'error': '중복된 닉네임이 있습니다.'});
        } else if(nick11.test(req.body.nickname)){
            return res.status(401).json({'error': '10글자 이상 입력되었습니다.'});
        } else if(nickreg.test(req.body.nickname)){
            return res.status(401).json({'error': '공백이 포함되었습니다.'});
        }
        if (!nick11.test(req.body.nickname)&&!nickreg.test(req.body.nickname)&&!dialogId!==req.body.nickname &&!users.find(user => user.nickname === req.body.nickname)) {
            // 로그인 성공시 json 형식으로 응답 보내기
            const userIndex = users.findIndex(user => user.nickname === dialogId);
            if (userIndex === -1) {
                return res.status(404).json({ 'error': '사용자를 찾을 수 없습니다.' });
            }
        
            // 닉네임 수정
            users[userIndex].nickname = req.body.nickname;
        
            await fs.promises.writeFile(filePath, JSON.stringify(users, null, 2), 'utf8');
            return res.status(200).json({"message": "닉네임 수정 성공!", "user_id": 1});
        } else {
            // 이메일 또는 비밀번호가 일치하지 않음
            return res.status(400).json({'error': 'invalid_request', 'message': '이메일 또는 비밀번호가 일치하지 않습니다.'});
        }
    } catch (error) {
        console.error('파일 처리 중 오류 발생:', error.message); // 에러 메시지만 출력
        return res.status(500).json({'error': 'internal_server_error', 'message': '서버 오류 발생'});
    }

})

app.delete('/users/infochange/:id', async (req, res) => {
    const dialogId = req.params.id;
    const email =req.body.email;
    console.log(dialogId); 
    try {
        let users = [];
        
        if (fs.existsSync(filePath)) {
            const fileContent = await fs.promises.readFile(filePath, 'utf8');
            users = JSON.parse(fileContent);
        }

        // 이메일과 비밀번호 일치 여부 확인
        const user = users.find(user => user.nickname === dialogId);
        const emailf = users.findIndex(user => user.email === email);
        if(users[emailf]===user){
            users.splice(emailf, 1); //유저 정보 삭제
        
            await fs.promises.writeFile(filePath, JSON.stringify(users, null, 2), 'utf8');
            return res.status(200).json({"message": "삭제 성공!", "user_id": 1});
        } else {
            // 이메일 또는 비밀번호가 일치하지 않음
            return res.status(400).json({'error': 'invalid_request', 'message': '삭제 진행중 문제 발생~~.'});
        }
    } catch (error) {
        console.error('파일 처리 중 오류 발생:', error.message); // 에러 메시지만 출력
        return res.status(500).json({'error': 'internal_server_error', 'message': '서버 오류 발생'});
    }
})


app.post('/users/passwordcange/:id', async (req, res) => {
    const dialogId = req.params.id;
    console.log(dialogId); 
    try {
        
        let users = [];
        
        // Users.json 파일이 있으면 기존 사용자 데이터 불러오기
        if (fs.existsSync(filePath)) {
            const fileContent = await fs.promises.readFile(filePath, 'utf8');
            users = JSON.parse(fileContent);
        }

        // 사용자가 존재하는지 확인
        const userIndex = users.findIndex(user => user.nickname === dialogId);
        
        if (userIndex === -1) {
            return res.status(404).json({'error' : '유저 정보가 없습니다.'});
        }

        // 비밀번호 유효성 검사
        if (!passwordreg.test(req.body.password)) {
            return res.status(401).json({'message' : '유효성 검사 실패. 비밀번호는 8~20자의 최소 대문자 영문1개, 특수문자 1개를 포함해야 합니다.'});
        }

        // 닉네임에 해당하는 유저의 비밀번호 변경
        users[userIndex].password = req.body.password;

        // 변경된 사용자 정보 파일에 저장
        await fs.promises.writeFile(filePath, JSON.stringify(users, null, 2), 'utf8');
        
        // 성공 응답
        return res.status(200).json({"message": "비밀번호 변경 성공!", "user_id": 1});
        
    } catch (error) {
        console.error('파일 처리 중 오류 발생:', error.message); // 에러 메시지만 출력
        return res.status(500).json({'error': 'internal_server_error', 'message': '서버 오류 발생'});
    }
});

// 서버 실행
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

