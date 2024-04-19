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

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  check.email = emailCheck(emailEl.value, redEmailEl);
  check.password = pwdCheck(pwdEl.value, redPwdEl);
  if (check.email && check.password) {
    console.log(emailEl.value, pwdEl.value);
    formEl.submit();
  }
});
