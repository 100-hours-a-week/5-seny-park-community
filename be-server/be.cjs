// commonJS로 변경하기
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { fileURLToPath } = require("url");
const bodyParser = require("body-parser");

const usersController = require("./controllers/users.controller");
const postsController = require("./controllers/posts.controller");

const PORT = 4000;

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(bodyParser.json());
// app.use("/users", usersRouter);
// app.use("/posts", postsRouter);

const fileUsersPath = path.join(__dirname, "./models/users.model.json");
const filePostsPath = path.join(__dirname, "./models/posts.model.json");

// 로그인
app.post("/users/login", usersController.postLogin);

// 회원가입
app.post("/users/signin", usersController.postSignup);

// 회원정보 수정페이지 - 회원정보 가져오기
app.get("/users/editprofile", usersController.getEditProfile);

// 회원정보 수정페이지 - 수정된 정보 저장
app.post("/users/editprofile", usersController.postEditProfile);

// 게시글 목록
app.get("/posts", postsController.getPosts);

// 게시글 상세 페이지
app.get("/posts/:postId", postsController.getPost);

// 게시글 수정 페이지
app.get("/edit/posts/:postId", postsController.getEditPost);

// 게시글 수정 페이지 - 수정된 정보 저장
app.post("/edit/posts/:postId", postsController.postEditPost);

// 게시글 등록
app.post("/posts/createpost", postsController.postPost);

// 게시글 삭제
app.delete("/posts/:postId", postsController.deletePost);

// 댓글 추가 & 수정
app.post("/posts/:postId/comment", postsController.postComment);

// 댓글 삭제
app.delete("/posts/:postId/comment/:commentId", postsController.deleteComment);

app.listen(PORT, () => {
  console.log(`앱이 포트 ${PORT}에서 실행 중입니다.`);
});
