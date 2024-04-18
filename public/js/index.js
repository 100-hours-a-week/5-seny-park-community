const formEl = document.querySelector("#login-form");
const emailEl = document.querySelector("#email");
const pwdEl = document.querySelector("#password");
const inputEl = document.querySelectorAll("input");
const redEmailEl = document.querySelector(".red.email");
const redPwdEl = document.querySelector(".red.pwd");

// inputEl.forEach((el) => {
//   el.addEventListener("input", (event) => {
//     console.log(event.target.value);
//   });
// });

formEl.addEventListener("input", (event) => {
  if (event.target.id === "email") {
    console.log("email", event.target.value);
    emailCheck(event.target.value);
  }
  if (event.target.id === "password") {
    console.log("password", event.target.value);
    pwdCheck(event.target.value);
  }
});

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = {
    email: formEl.email.value,
    password: event.target.password.value,
  };
  console.log(data);
});

const emailCheck = (email) => {
  redEmailEl.classList.add("helper-text");
  const regex = /\w+@\w+\.\w+/;
  if (email.length === 0) {
    redEmailEl.innerHTML = "이메일을 입력해주세요";
    // } else if (!email.includes("@")) {
  } else if (!regex.test(email)) {
    // 정규표현식으로 이메일 형식 검사
    redEmailEl.innerHTML = "올바른 이메일 주소 형식을 입력해주세요.";
  } else {
    redEmailEl.innerHTML = "";
    redEmailEl.classList.remove("helper-text");
  }
};

const pwdCheck = (pwd) => {
  redPwdEl.classList.add("helper-text");
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
  if (pwd.length === 0) {
    redPwdEl.innerHTML = "비밀번호를 입력해주세요";
  } else if (!regex.test(pwd)) {
    redPwdEl.innerHTML =
      "비밀번호는 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    if (pwd.length < 8 || pwd.length > 20) {
      redPwdEl.innerHTML = "비밀번호는 8자 이상 20자 이하여야 합니다.";
    }
  } else {
    redPwdEl.innerHTML = "";
    redPwdEl.classList.remove("helper-text");
  }
};
