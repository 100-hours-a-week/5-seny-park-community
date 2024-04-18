const formEl = document.querySelector("#login-form");
const emailEl = document.querySelector("#email");
const pwdEl = document.querySelector("#password");
const inputEl = document.querySelectorAll("input");
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
    check.email = emailCheck(event.target.value);
  }
  if (event.target.id === "password") {
    check.password = pwdCheck(event.target.value);
  }

  if (check.email && check.password) {
    console.log(emailEl.value, pwdEl.value);
    loginBtn.classList.add("active");
  } else {
    loginBtn.classList.remove("active");
  }
});

const emailCheck = (email) => {
  redEmailEl.classList.add("helper-text");
  const regex = /\w+@\w+\.\w+/;
  if (email.length === 0) {
    redEmailEl.innerHTML = "이메일을 입력해주세요";
    return false;
  } else if (!regex.test(email)) {
    redEmailEl.innerHTML = "올바른 이메일 주소 형식을 입력해주세요.";
    return false;
  } else {
    redEmailEl.innerHTML = "";
    redEmailEl.classList.remove("helper-text");
    return true;
  }
};

const pwdCheck = (pwd) => {
  redPwdEl.classList.add("helper-text");
  if (pwd.length === 0) {
    redPwdEl.innerHTML = "비밀번호를 입력해주세요";
    return false;
  } else if (pwd.length < 8 || pwd.length > 20) {
    redPwdEl.innerHTML = "비밀번호는 8자 이상 20자 이하여야 합니다.";
    return false;
  }
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
  if (!regex.test(pwd)) {
    redPwdEl.innerHTML =
      "비밀번호는 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    return false;
  } else {
    redPwdEl.innerHTML = "";
    redPwdEl.classList.remove("helper-text");
    return true;
  }
};
