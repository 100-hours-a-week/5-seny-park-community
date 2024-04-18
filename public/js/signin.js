import {
  handleSelected,
  emailCheck,
  pwdCheck,
  pwdCheckSame,
  nicknameCheck,
} from "/js/utils.js";

const formEl = document.querySelector("#signin-form");
// 회원가입 이미지 업로드
const fileInput = document.querySelector("#profileUpload"); // input[type="file"] - display:none
const imgPrevEl = document.querySelector(".mid"); // img 보이는 태그
// const reader = new FileReader(); // 파일 읽기 객체
// 회원가입 텍스트 폼 유효성 검사
const pwdEl = document.querySelector("#password");
const redEmailEl = document.querySelector(".red.email");
const redPwdEl = document.querySelector(".red.pwd");
const redPwdCheckEl = document.querySelector(".red.pwd-check");
const redNicknameEl = document.querySelector(".red.nickname");
// 회원가입 버튼
const signinBtn = document.querySelector(".inner .btn");

// 이미지 업로드
fileInput.addEventListener("change", () =>
  handleSelected(fileInput, imgPrevEl)
);

// 회원가입 텍스트 폼 유효성 검사
let check = {
  email: false,
  password: false,
  checkPassword: false,
  nickname: false,
};

formEl.addEventListener("input", (event) => {
  if (event.target.id === "email") {
    check.email = emailCheck(event.target.value, redEmailEl);
  }
  if (event.target.id === "password") {
    check.password = pwdCheck(event.target.value, redPwdEl);
  }
  if (event.target.id === "checkPassword") {
    check.checkPassword = pwdCheckSame(
      pwdEl.value,
      event.target.value,
      redPwdCheckEl
    );
  }
  if (event.target.id === "nickname") {
    check.nickname = nicknameCheck(event.target.value, redNicknameEl);
  }
  if (check.email && check.password && check.checkPassword && check.nickname) {
    // formEl.submit();
    console.log(
      formEl.elements.email.value,
      formEl.elements.password.value,
      formEl.elements.nickname.value
    );
    signinBtn.classList.add("active");
  } else {
    signinBtn.classList.remove("active");
  }
});
