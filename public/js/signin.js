// 회원가입 폼
const formEl = document.querySelector("#signin-form");
// 회원가입 이미지 업로드
const fileInput = document.querySelector("#profileUpload"); // input[type="file"] - display:none
const imgPrevEl = document.querySelector(".mid"); // img 보이는 태그
const reader = new FileReader(); // 파일 읽기 객체
// 회원가입 텍스트 폼 유효성 검사
const emailEl = document.querySelector("#email");
const pwdEl = document.querySelector("#password");
const inputEl = document.querySelectorAll("input");
const redEmailEl = document.querySelector(".red.email");
const redPwdEl = document.querySelector(".red.pwd");
const redPwdCheckEl = document.querySelector(".red.pwd-check");
const redNicknameEl = document.querySelector(".red.nickname");

// 이미지 업로드
function handleEvent(event) {
  if (event.type === "load") {
    imgPrevEl.style.backgroundImage = `url(${reader.result})`;
    console.log(reader.result);
  }
}

function addListeners(reader) {
  reader.addEventListener("loadstart", handleEvent);
  reader.addEventListener("load", handleEvent);
  reader.addEventListener("loadend", handleEvent);
  reader.addEventListener("progress", handleEvent);
  reader.addEventListener("error", handleEvent);
  reader.addEventListener("abort", handleEvent);
}

function handleSelected(e) {
  const selectedFile = fileInput.files[0];
  if (selectedFile) {
    addListeners(reader);
    reader.readAsDataURL(selectedFile);
  }
}

fileInput.addEventListener("change", handleSelected);

// 회원가입 텍스트 폼 유효성 검사
formEl.addEventListener("input", (event) => {
  if (event.target.id === "email") {
    console.log("email", event.target.value);
    console.log("Email check:", emailCheck(event.target.value));
  }
  if (event.target.id === "password") {
    console.log("password", event.target.value);
    console.log("Password check:", pwdCheck(event.target.value));
  }
  if (event.target.id === "checkPassword") {
    console.log("checkPassword", event.target.value);
    console.log(
      "Password match check:",
      pwdCheckSame(pwdEl.value, event.target.value)
    );
  }
  if (event.target.id === "nickname") {
    console.log("nickname", event.target.value);
    console.log("Nickname check:", nicknameCheck(event.target.value));
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

const pwdCheckSame = (pwd, pwdCheck) => {
  redPwdCheckEl.classList.add("helper-text");
  if (pwd !== pwdCheck) {
    redPwdCheckEl.innerHTML = "비밀번호가 일치하지 않습니다.";
    return false;
  } else {
    redPwdCheckEl.innerHTML = "";
    redPwdCheckEl.classList.remove("helper-text");
    return true;
  }
};

const nicknameCheck = (nickname) => {
  redNicknameEl.classList.add("helper-text");
  if (nickname.length === 0) {
    redNicknameEl.innerHTML = "닉네임을 입력해주세요";
    return false;
  } else {
    redNicknameEl.innerHTML = "";
    redNicknameEl.classList.remove("helper-text");
    return true;
  }
};
