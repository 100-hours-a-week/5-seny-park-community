import { pwdCheck, pwdCheckSame } from "/js/utils.js";

const formEl = document.querySelector("#edit-pw-form");
// 비밀번호 변경 페이지 텍스트 폼 유효성 검사
const pwdEl = document.querySelector("#password");
const redPwdEl = document.querySelector(".red.pwd");
const redPwdCheckEl = document.querySelector(".red.pwd-check");
const editBtn = document.querySelector(".input .btn");
// 수정하기 버튼 클릭 시 토스트 페이지 이벤트
const toastEl = document.querySelector(".toast");

// 비밀번호 변경 폼 유효성 검사
let check = {
  password: false,
  checkPassword: false,
};

formEl.addEventListener("input", (event) => {
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
  if (check.password && check.checkPassword) {
    console.log(check.password, check.checkPassword);
    // formEl.submit();
    console.log(formEl.elements.password.value);
    editBtn.classList.add("active");
  } else {
    editBtn.classList.remove("active");
  }
});

formEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  check.password = pwdCheck(pwdEl.value, redPwdEl);
  check.checkPassword = pwdCheckSame(
    pwdEl.value,
    formEl.elements.checkPassword.value,
    redPwdCheckEl
  );

  if (check.password && check.checkPassword) {
    const response = await fetch(`http://localhost:4000/users/editpwd`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: formEl.elements.password.value,
      }),
      credentials: "include", // 쿠키를 요청과 함께 보내도록 설정
    });
    console.log(response);
    if (response.status === 201) {
      toastEl.classList.add("active");
      setTimeout(() => {
        // 1초 후 토스트 el 사라짐
        toastEl.classList.remove("active");
      }, 1000);
    }
  }
});
