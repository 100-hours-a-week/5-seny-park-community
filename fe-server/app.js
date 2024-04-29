import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
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

// // 게시글 작성
// app.post("/posts", (req, res) => {
//   const { postTitle, postContent, postPicture } = req.body;
//   console.log(`Received new post: ${postTitle}`);

//   fs.readFile(filePostsPath, "utf-8", (err, data) => {
//     if (err) {
//       console.error("Error reading posts file:", err);
//       return res.status(500).send("Failed to load posts data.");
//     }

//     let posts;
//     posts = JSON.parse(data);

//     posts.push({
//       post_id: posts.length + 1,
//       post_title: postTitle,
//       post_content: postContent,
//       attach_file_path: postPicture,
//       user_id: "5840b9c4da0529cd293d7700",
//       created_at: new Date(),
//       updated_at: new Date(),
//       deleted_at: null,
//       nickname: "배고픈강아지",
//       profileImagePath:
//         "https://i.pinimg.com/564x/d9/23/1d/d9231dd1faf237fc69a6e4d5f6723d05.jpg",
//       like: 0,
//       hits: 0,
//       comment_count: 0,
//       comment: [],
//     });

//     fs.writeFile(filePostsPath, JSON.stringify(posts), (writeErr) => {
//       if (writeErr) {
//         console.error("Failed to write to posts file:", writeErr);
//         return res.status(500).send("Failed to save post.");
//       }
//       console.log("Post added successfully.");
//       // res.redirect("/html/main.html");
//     });
//   });
// });

// 게시글 수정
app.post("/posts/edit", (req, res) => {
  const { postTitle, postContent, postPicture } = req.body;

  fs.readFile(filePostsPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("게시글 불러오기에 실패했습니다.");
    }

    let posts;

    posts = JSON.parse(data);
    const postId = 7;
    console.log(posts[postId - 1]);
    posts[postId - 1].post_title = postTitle;
    posts[postId - 1].post_content = postContent;
    // posts[postId - 1].attach_file_path = postPicture;
    posts[postId - 1].updated_at = new Date();

    fs.writeFile(filePostsPath, JSON.stringify(posts), (writeErr) => {
      if (writeErr) {
        return res.status(500).send("게시글 수정에 실패했습니다.");
      }
      res.redirect("/html/post.html");
    });
  });
});

app.listen(port, () => {
  console.log(`앱이 포트 ${port}에서 실행 중입니다.`);
});

// 댓글 추가
app.post("/posts/comment", (req, res) => {
  const { comment } = req.body;
  const postId = 7;

  fs.readFile(filePostsPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("게시글 불러오기에 실패했습니다.");
    }

    let posts;
    posts = JSON.parse(data);
    posts[postId - 1].comments.push({
      comment_id: posts[postId - 1].comments.length + 1,
      user_id: "583c3a7ff38e84297c002545",
      nickname: "행복한댕댕이",
      profileImagePath:
        "https://i.pinimg.com/564x/c2/00/42/c20042e84a280a18ed2fbeb8be998978.jpg",
      comment: comment,
      created_at: new Date(),
    });

    fs.writeFile(filePostsPath, JSON.stringify(posts), (writeErr) => {
      if (writeErr) {
        return res.status(500).send("댓글 추가에 실패했습니다.");
      }
      res.redirect("/html/post.html");
    });
  });
});

// 프로필 수정
app.post("/users/edit", (req, res) => {
  const { nickname } = req.body;
  console.log(`Nickname: ${nickname}`);

  fs.readFile(fileUsersPath, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("사용자 정보를 읽어오는데 실패했습니다.");
    }
    const users = JSON.parse(data); // JSON 형식의 문자열을 객체로 변환
    const userId = 1;
    console.log(users[userId - 1]);
    users[userId - 1].nickname = nickname;
    users[userId - 1].updated_at = new Date();

    fs.writeFile(fileUsersPath, JSON.stringify(users), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      // res.redirect("/");
    });
  });
});

/**
 *
 * 개발 과정에서 안쓰는 코드는 지우시는게 좋습니다.
 * 나중에 참고해야 할 경우가 있다하시면 깃 커밋 남기시고 날리세요
 * 새로운 로직 짤때 방해 됩니다. 커밋이 귀찮으시면 code_grave.js 같은 이름으로 파일을 만들어서 옮기셔도 됩니다.
 */
