const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const fileUsersPath = path.join(__dirname, "../models/users.model.json");

// 로그인
const postLogin = (req, res) => {
  const { email, password } = req.body;
  console.log(`Email be: ${email}, Password: ${password}`);
  console.log(req.body, req.file);

  fs.readFile(fileUsersPath, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("사용자 정보를 읽어오는데 실패했습니다.");
    }

    const users = JSON.parse(data);
    console.log(users);

    const user = users.find((user) => user.email === email);

    if (!user) {
      // 회원정보 없음
      return res.status(404).json({
        emailExists: false,
        pwdExists: false,
        message: "Email does not exist.",
      });
    }
    // 회원정보 있으나 비번 틀린 경우
    // bcrypt.compareSync(입력한 비밀번호, 암호화된 비밀번호)
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({
        emailExists: true,
        pwdExists: false,
        message: "Password does not match.",
      });
    }
    // 회원정보 있고 비번 일치
    return res.status(200).json({
      emailExists: true,
      pwdExists: true,
      message: "Login successful.",
    });
  });
};

// 회원가입
const postSignup = (req, res) => {
  const { email, password, nickname } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 12); // 비밀번호 암호화
  console.log(
    `Email: ${email}, Password: ${hashedPassword}, Nickname: ${nickname}`
  );

  const profilePicture = req.file; // 업로드된 프로필 사진 파일 정보

  // 파일 경로 설정
  const profileImagePath = profilePicture ? profilePicture.path : null;

  fs.readFile(fileUsersPath, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("사용자 정보를 읽어오는데 실패했습니다.");
    }

    const users = JSON.parse(data); // JSON 형식의 문자열을 객체로 변환
    const emailExists = users.some((user) => user.email === email); // 중복 이메일 체크
    const nicknameExists = users.some((user) => user.nickname === nickname); // 중복 닉네임 체크
    if (emailExists || nicknameExists) {
      return res.json({ emailExists, nicknameExists });
    }

    users.push({
      user_id: users.length + 1,
      email: email,
      password: hashedPassword,
      nickname: nickname,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      auth_token: null,
      profileImagePath: `http://localhost:4000/${profileImagePath}`,
    });

    fs.writeFile(fileUsersPath, JSON.stringify(users), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      res.status(201).json({ message: "회원가입성공" });
    });
  });
};

// 회원정보 수정페이지 - 회원정보 가져오기
const getEditProfile = (req, res) => {
  fs.readFile(fileUsersPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("사용자 정보를 읽어오는데 실패했습니다.");
    }
    const users = JSON.parse(data);
    const user = users.find((user) => user.user_id === 13); // 임의로 첫번째 사용자 정보 가져옴
    console.log(user, 111);
    res.json(user);
  });
};

// 회원정보 수정페이지 - 수정된 정보 저장
const postEditProfile = (req, res) => {
  const { nickname } = req.body;
  const profilePicture = req.file; // 업로드된 프로필 사진 파일 정보
  const profileImagePath = profilePicture ? profilePicture.path : null;

  fs.readFile(fileUsersPath, "utf-8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "사용자 정보를 읽어오는데 실패했습니다." });
    }
    const users = JSON.parse(data);
    const user = users.find((user) => user.user_id === 13); // 임의로 첫번째 사용자 정보 가져옴
    const nicknameExists = users.some(
      (diffuser) =>
        diffuser.nickname === nickname && diffuser.user_id !== user.user_id
    );
    console.log(nicknameExists);
    if (nicknameExists) {
      return res.json({ nicknameExists });
    }
    console.log(
      profilePicture,
      profileImagePath,
      `http://localhost:4000/${profileImagePath}`
    );

    user.profileImagePath = `http://localhost:4000/${profileImagePath}`;
    user.nickname = nickname;
    user.updated_at = new Date();
    fs.writeFile(fileUsersPath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "닉네임 수정 실패" });
      }
      return res.status(201).json({ message: "닉네임 수정 성공" });
    });
  });
};

// 회원정보 비밀번호 수정 - 수정된 정보 저장
const postEditPwd = (req, res) => {
  const { password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 12); // 비밀번호 암호화
  fs.readFile(fileUsersPath, "utf-8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "사용자 정보를 읽어오는데 실패했습니다." });
    }
    const users = JSON.parse(data);
    const user = users.find((user) => user.user_id === 13); // 임의로 첫번째 사용자 정보 가져옴
    console.log(user.password, hashedPassword);
    user.password = hashedPassword;
    user.updated_at = new Date();
    console.log(user, password);
    fs.writeFile(fileUsersPath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "비밀번호 수정 실패" });
      }
      console.log("수정성공");
      return res.status(201).json({ message: "비밀번호 수정 성공" });
    });
  });
};

module.exports = {
  postLogin,
  postSignup,
  getEditProfile,
  postEditProfile,
  postEditPwd,
};
