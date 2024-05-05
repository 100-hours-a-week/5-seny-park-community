// commonJS로 변경하기
const express = require("express");
const PORT = 4000;
const cors = require("cors");
const path = require("path");
const { fileURLToPath } = require("url");
const bodyParser = require("body-parser");
const usersRouter = require("./routes/users.router");
const postsRouter = require("./routes/posts.router");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(bodyParser.json());

app.use("/users", usersRouter);
app.use("/posts", postsRouter);

app.listen(PORT, () => {
  console.log(`앱이 포트 ${PORT}에서 실행 중입니다.`);
});
