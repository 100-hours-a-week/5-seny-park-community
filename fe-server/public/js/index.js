import { emailCheck, pwdCheck } from "/js/utils.js";
const formEl = document.querySelector("#login-form");
const emailEl = document.querySelector("#email");
const pwdEl = document.querySelector("#password");
const redEmailEl = document.querySelector(".red.email");
const redPwdEl = document.querySelector(".red.pwd");
// 로그인 버튼
const loginBtn = document.querySelector(".inner .btn");

// 회원가입 텍스트 폼 유효성 검사
let check = {
  email: false,
  password: false,
};

formEl.addEventListener("input", (event) => {
  if (event.target.id === "email") {
    console.log(event.target.value, redEmailEl.textContent);
    check.email = emailCheck(event.target.value, redEmailEl);
  }
  if (event.target.id === "password") {
    check.password = pwdCheck(event.target.value, redPwdEl);
  }

  if (check.email && check.password) {
    console.log(emailEl.value, pwdEl.value);
    loginBtn.classList.add("active");
  } else {
    loginBtn.classList.remove("active");
  }
});

// json 내 유저정보와 일치하는 경우에만 submit
formEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  check.email = emailCheck(emailEl.value, redEmailEl);
  check.password = pwdCheck(pwdEl.value, redPwdEl);
  console.log(emailEl.value, pwdEl.value, check.email, check.password);

  const response = await fetch("http://localhost:4000/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: emailEl.value,
      password: pwdEl.value,
    }),
  });

  const data = await response.json();
  if (!data.emailExists) {
    redEmailEl.textContent = "이메일이 존재하지 않습니다.";
  }
  if (data.emailExists && !data.pwdExists) {
    redPwdEl.textContent = "비밀번호가 일치하지 않습니다.";
  }
  if (data.emailExists && data.pwdExists) {
    alert("로그인 성공");
    location.href = "/html/main.html";
  }
});
