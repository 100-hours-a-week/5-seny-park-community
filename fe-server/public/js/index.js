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

// fetch로 json 파일 불러오기
// 미리 받아오면 안된다.
const users = [];
fetch("/json/users.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    data.forEach((user) => {
      users.push({ email: user.email, password: user.password });
    });
    console.log(users);
  });

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
formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  check.email = emailCheck(emailEl.value, redEmailEl);
  check.password = pwdCheck(pwdEl.value, redPwdEl);
  if (users.length && check.email && check.password) {
    let next = users.find((user) => user.email == emailEl.value);
    if (next) {
      next = users.find((user) => user.password == pwdEl.value);
      if (next) {
        formEl.submit();
      } else {
        alert("비밀번호가 일치하지 않습니다.");
      }
    } else {
      alert("아이디가 존재하지 않습니다.");
    }
  }
});
