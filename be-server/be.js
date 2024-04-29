import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
// commonJS로 변경하기
// const express = require("express");
// const cors = require("cors");
// const fs = require("fs");
// const path = require("path");
// const { fileURLToPath } = require("url");
// const bodyParser = require("body-parser");

// const usersRouter = require("./routes/users.router");
// const postsRouter = require("./routes/posts.router");

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileUsersPath = path.join(__dirname, "./models/users.model.json");
const filePostsPath = path.join(__dirname, "./models/posts.model.json");

// 로그인
app.post("/users/login", (req, res) => {
  const { email, password } = req.body;
  console.log(`Email be: ${email}, Password: ${password}`);

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
    if (user.password !== password) {
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
});

// 회원가입
app.post("/users/signin", (req, res) => {
  const { email, password, nickname } = req.body;
  console.log(`Email: ${email}, Password: ${password}, Nickname: ${nickname}`);

  fs.readFile(fileUsersPath, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("사용자 정보를 읽어오는데 실패했습니다.");
    }

    const users = JSON.parse(data); // JSON 형식의 문자열을 객체로 변환
    console.log(users);
    const emailExists = users.some((user) => user.email === email); // 중복 이메일 체크
    const nicknameExists = users.some((user) => user.nickname === nickname); // 중복 닉네임 체크
    if (emailExists || nicknameExists) {
      return res.json({ emailExists, nicknameExists });
    }

    users.push({
      user_id: users.length + 1,
      email: email,
      password: password,
      nickname: nickname,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      auth_token: null,
    });

    fs.writeFile(fileUsersPath, JSON.stringify(users), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      res.status(201).json({ message: "회원가입성공" });
    });
  });
});

// 게시글 목록
app.get("/posts", (req, res) => {
  fs.readFile(filePostsPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("게시글 불러오기에 실패했습니다.");
    }
    const posts = JSON.parse(data);
    res.json(posts);
  });
});

// 게시글 상세 페이지
app.get("/posts/:postId", (req, res) => {
  const postId = req.params.postId;
  fs.readFile(filePostsPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("게시글 불러오기에 실패했습니다.");
    }
    const posts = JSON.parse(data); // JSON 형식의 문자열을 객체로 변환
    const post = posts.find((post) => post.post_id === Number(postId));
    post.hits = Number(post.hits) + 1; // 조회수 증가

    console.log(post);
    // 업데이트된 게시글 정보를 파일에 저장
    fs.writeFile(filePostsPath, JSON.stringify(posts, null, 2), (err) => {
      if (err) {
        return res.status(500).send("조회수 업데이트에 실패했습니다.");
      }

      res.json(post);
    });
  });
});

app.get("/edit/posts/:postId", (req, res) => {
  const postId = req.params.postId;
  console.log(`PostId: ${postId}`);
  fs.readFile(filePostsPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("게시글 불러오기에 실패했습니다.");
    }
    const posts = JSON.parse(data);
    const post = posts.find((post) => post.post_id === Number(postId));
    res.json(post);
  });
});

app.post("/edit/posts/:postId", (req, res) => {
  const postId = req.params.postId;
  const { title, content } = req.body;
  console.log(`Title: ${title}, Content: ${content}`);
  fs.readFile(filePostsPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("게시글 불러오기에 실패했습니다.");
    }
    const posts = JSON.parse(data);
    const post = posts.find((post) => post.post_id === Number(postId));
    console.log(post);
    post.post_title = title;
    post.post_content = content;
    post.updated_at = new Date();
    fs.writeFile(filePostsPath, JSON.stringify(posts, null, 2), (err) => {
      if (err) {
        return res.status(500).send("게시글 수정에 실패했습니다.");
      }
      return res.status(201).send("게시글 수정 성공");
    });
  });
});

app.listen(PORT, () => {
  console.log(`앱이 포트 ${PORT}에서 실행 중입니다.`);
});

// 댓글 추가
app.post("/posts/:postId/comment", (req, res) => {
  const postId = req.params.postId;
  const { comment, user_id, nickname, profileImagePath, created_at } = req.body;
  fs.readFile(filePostsPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("댓글 불러오기에 실패했습니다.");
    }
    const posts = JSON.parse(data);
    const post = posts.find((post) => post.post_id === Number(postId));
    let commentId;
    if (post.comments.length > 0) {
      commentId = post.comments[post.comments.length - 1].comment_id + 1;
    } else {
      commentId = 1;
    }
    post.comments.push({
      comment_id: commentId,
      user_id: user_id,
      nickname: nickname,
      profileImagePath: profileImagePath,
      comment: comment,
      created_at: created_at,
    });
    fs.writeFile(filePostsPath, JSON.stringify(posts, null, 2), (err) => {
      if (err) {
        return res.status(500).send("댓글 추가에 실패했습니다.");
      }
      return res.status(201).send("댓글 추가 성공");
    });
  });
});

// 회원정보 수정페이지 - 회원정보 가져오기
app.get("/users/editprofile", (req, res) => {
  fs.readFile(fileUsersPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("사용자 정보를 읽어오는데 실패했습니다.");
    }
    const users = JSON.parse(data);
    const user = users.find(
      (user) => user.user_id === "583c3ac3f38e84297c002546"
    ); // 임의로 첫번째 사용자 정보 가져옴
    console.log(user);
    res.json(user);
  });
});

// 회원정보 수정페이지 - 수정된 정보 저장
app.post("/users/editprofile", (req, res) => {
  const { nickname } = req.body;
  fs.readFile(fileUsersPath, "utf-8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "사용자 정보를 읽어오는데 실패했습니다." });
    }
    const users = JSON.parse(data);
    const user = users.find(
      (user) => user.user_id === "583c3ac3f38e84297c002546"
    ); // 임의로 첫번째 사용자 정보 가져옴
    const nicknameExists = users.some(
      (diffuser) =>
        diffuser.nickname === nickname && diffuser.user_id !== user.user_id
    );
    console.log(nicknameExists);
    if (nicknameExists) {
      return res.json({ nicknameExists });
    }
    user.nickname = nickname;
    user.updated_at = new Date();
    fs.writeFile(fileUsersPath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "닉네임 수정 실패" });
      }
      return res.status(201).json({ message: "닉네임 수정 성공" });
    });
  });
});

// 게시글 등록
app.post("/posts/createpost", (req, res) => {
  const { title, content } = req.body;
  fs.readFile(filePostsPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("게시글 불러오기에 실패했습니다.");
    }
    const posts = JSON.parse(data);
    posts.push({
      post_id: posts[posts.length - 1].post_id + 1, // 마지막 게시글 id + 1
      post_title: title,
      post_content: content,
      attach_file_path: "",
      file_id: null,
      user_id: "583c3ac3f38e84297c002546",
      profileImagePath:
        "https://i.pinimg.com/564x/4d/50/fe/4d50fe8cc1918b8a9b6e6fb8499d1c76.jpg",
      nickname: "엉뚱한개굴",
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      like: 0,
      hits: 0,
      comments: [],
    });
    fs.writeFile(filePostsPath, JSON.stringify(posts, null, 2), (err) => {
      if (err) {
        return res.status(500).send("게시글 추가에 실패했습니다.");
      }
      return res.status(201).send("게시글 추가 성공");
    });
  });
});
