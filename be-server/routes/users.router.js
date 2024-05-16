const express = require("express");
const usersRouter = express.Router();
const usersController = require("../controllers/users.controller");
const multer = require("multer");

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, "../images/"); // 이미지 저장 경로  상대경로 아닌 루트 디렉토리 기준으로 경로 설정
    cb(null, "images/profile"); // 이미지 저장 경로
  },
  filename: (req, file, cb) => {
    const originalFileName = file.originalname;
    const sanitizedFileName = originalFileName.replace(/[^\w.-]/g, ""); //  파일명에 포함된 특수문자나 공백을 제거
    cb(null, `${new Date().valueOf()}_${sanitizedFileName}`); // 이미지 파일명
  },
});

const upload = multer({ storage: storage });

// 로그인
usersRouter.post("/login", usersController.postLogin);

// 로그아웃
usersRouter.get("/logout", usersController.getLogout);

// 회원가입
usersRouter.post(
  "/signin",
  upload.single("profilePicture"),
  usersController.postSignup
);

// 회원정보 수정페이지 - 회원정보 가져오기
usersRouter.get("/editprofile", usersController.getEditProfile);

// 회원정보 수정페이지 - 수정된 정보 저장
usersRouter.post(
  "/editprofile",
  upload.single("profilePicture"),
  usersController.postEditProfile
);

// 회원정보 비밀번호 수정페이지 - 비밀번호 수정
usersRouter.post("/editpwd", usersController.postEditPwd);

module.exports = usersRouter;
