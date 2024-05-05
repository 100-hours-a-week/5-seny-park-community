const express = require("express");
const usersRouter = express.Router();
const usersController = require("../controllers/users.controller");

// 로그인
usersRouter.post("/login", usersController.postLogin);

// 회원가입
usersRouter.post("/signin", usersController.postSignup);

// 회원정보 수정페이지 - 회원정보 가져오기
usersRouter.get("/editprofile", usersController.getEditProfile);

// 회원정보 수정페이지 - 수정된 정보 저장
usersRouter.post("/editprofile", usersController.postEditProfile);

module.exports = usersRouter;
