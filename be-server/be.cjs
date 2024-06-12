// commonJS로 변경하기
const express = require("express");
const PORT = 4000;
const cors = require("cors");
const bodyParser = require("body-parser");
const usersRouter = require("./routes/users.router");
const postsRouter = require("./routes/posts.router");
const path = require("path");
const session = require("express-session");

// 시크릿 키 .env 파일에서 가져오기
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const secretKey = process.env.SECRET_KEY;
const app = express();

// 정적 파일 제공을 위한 미들웨어
app.use(express.static("images"));

app.use(
  cors({
    origin: "http://localhost:3000", // 클라이언트 주소
    credentials: true, // 자격 증명과 함께 요청 허용
    methods: ["GET", "POST", "PUT", "DELETE"], // 허용할 HTTP 메소드
    allowedHeaders: ["Content-Type", "Authorization"], // 허용할 헤더
  })
);

app.use(bodyParser.json());

app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true, // 클라이언트에서 쿠키를 확인하지 못하도록 설정
      secure: false, // https가 아닌 환경에서도 사용할 수 있도록 설정
      // maxAge: 24 * 60 * 60 * 1000, // maxAge를 설정하지 않아 브라우저가 닫히면 쿠키가 삭제됨 - 세션쿠키
    },
  })
);

app.use("/users", usersRouter);
app.use("/posts", postsRouter);

app.listen(PORT, () => {
  console.log(`앱이 포트 ${PORT}에서 실행 중입니다.`);
});
