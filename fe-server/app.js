import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 정적 파일 제공을 위한 미들웨어
app.use(express.static("public"));
// 요청 본문을 파싱하기 위한 미들웨어
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  // 로그인
  res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/main", (req, res) => {
  // 메인 (== 게시글 목록 페이지)
  res.sendFile(path.join(__dirname, "public/html/main.html"));
});

app.get("/signin", (req, res) => {
  // 회원가입
  res.sendFile(path.join(__dirname, "public/html/signin.html"));
});

// 게시글 상세페이지
app.get("/main/post", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/post.html"));
});

app.get("/main/createpost", (req, res) => {
  // 게시글 작성
  res.sendFile(path.join(__dirname, "public/html/makepost.html"));
});

app.get("/main/edit/post", (req, res) => {
  // 게시글 수정
  res.sendFile(path.join(__dirname, "public/html/editpost.html"));
});

app.get("/users/editprofile", (req, res) => {
  // 프로필 수정
  res.sendFile(path.join(__dirname, "public/html/editprofile.html"));
});

app.get("/users/editpwd", (req, res) => {
  // 비밀번호 수정
  res.sendFile(path.join(__dirname, "public/html/editpwd.html"));
});

app.listen(port, () => {
  console.log(`앱이 포트 ${port}에서 실행 중입니다.`);
});
