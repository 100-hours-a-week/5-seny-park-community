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
  /**
   * console log 에 비밀번호를 찍는건 위험합니다.
   * 만약 실제 배포 나갈 때 콘솔로그에 비밀번호를 찍는 상태로 배포가 나가게 된다면 보안상 위험하므로 이러한 부분은
   * 디버깅 도구를 통해서 확인하시는게 좋습니다.
   */
  console.log(`Email: ${email}, Password: ${password}`);

  // 여기서 응답을 보내고 끝내려면 `res.send` 또는 `res.redirect` 중 하나만 사용해야 합니다.
  // 먼저 데이터를 클라이언트에게 보내고 싶다면 `res.send`를, 바로 페이지를 리디렉션하려면 `res.redirect`를 사용하세요.
  // res.send(`로그인 정보가 성공적으로 제출되었습니다! Email: ${email}, Password: ${password}`);

  // 인증 성공 후 메인 페이지로 리디렉션
  res.redirect("/html/main.html");
});

app.post("/submit-post-form", (req, res) => {
  const { postTitle, postContent, postPicture } = req.body;
  console.log(
    `Title: ${postTitle}, Content: ${postContent}, Picture: ${postPicture}`
  );

  res.redirect("/html/main.html");
});

app.listen(port, () => {
  console.log(`앱이 포트 ${port}에서 실행 중입니다.`);
});

/**
 *
 * 개발 과정에서 안쓰는 코드는 지우시는게 좋습니다.
 * 나중에 참고해야 할 경우가 있다하시면 깃 커밋 남기시고 날리세요
 * 새로운 로직 짤때 방해 됩니다. 커밋이 귀찮으시면 code_grave.js 같은 이름으로 파일을 만들어서 옮기셔도 됩니다.
 */
