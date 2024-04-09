import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 정적 파일 제공을 위한 미들웨어
app.use(express.static("public"));

// 요청 본문을 파싱하기 위한 미들웨어
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/submit-form", (req, res) => {
  // 요청 본문에서 이메일과 비밀번호 추출
  const { email, password } = req.body;
  console.log(`Email: ${email}, Password: ${password}`);

  // 여기서 응답을 보내고 끝내려면 `res.send` 또는 `res.redirect` 중 하나만 사용해야 합니다.
  // 먼저 데이터를 클라이언트에게 보내고 싶다면 `res.send`를, 바로 페이지를 리디렉션하려면 `res.redirect`를 사용하세요.
  // res.send(`로그인 정보가 성공적으로 제출되었습니다! Email: ${email}, Password: ${password}`);

  // 인증 성공 후 메인 페이지로 리디렉션
  res.redirect("/html/main.html");
});

app.listen(port, () => {
  console.log(`앱이 포트 ${port}에서 실행 중입니다.`);
});

// // Load the express module.
// import express from "express";
// import path from "path";

// // Create the express application.
// const app = express();
// // Define the port number to be used by the web server.
// const port = 3000;

// // Serve static files from 'public' and 'html' directories
// app.use(express.static("public"));
// app.use(express.static("html"));

// // Use express.urlencoded to parse incoming requests with urlencoded payloads
// app.use(express.urlencoded({ extended: true }));

// // Serve 'index.html' at the root path
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"));
// });

// // Route to process data when form is submitted
// app.post("/submit-form", (req, res) => {
//   // Extract email and password from request body
//   const { email, password } = req.body;
//   console.log(`Email: ${email}, Password: ${password}`);

//   // Notify the client that data has been successfully received
//   res.send(
//     `로그인 정보가 성공적으로 제출되었습니다! Email: ${email}, Password: ${password}`
//   );
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });

// // form이 제출되었을 때 데이터를 처리하는 라우트
// app.post("/submit-form", (req, res) => {
//   // 요청 본문에서 이메일과 비밀번호 추출
//   const { email, password } = req.body;
//   console.log(`Email: ${email}, Password: ${password}`);

//   // 성공적으로 데이터를 받았음을 클라이언트에게 알림
//   res.send(
//     `로그인 정보가 성공적으로 제출되었습니다! Email: ${email}, Password: ${password}`
//   );
//   // 인증 성공 후 메인 페이지로 리디렉션
//   // res.redirect("/html/main.html");
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
