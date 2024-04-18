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
// 회원가입 버튼
const signinBtn = document.querySelector(".inner .btn");

// 이미지 업로드
function handleEvent(event) {
  if (event.type === "load") {
    imgPrevEl.style.backgroundImage = `url(${reader.result})`; // .mid 태그에 이미지 삽입
    console.log("url:", reader.result);
    // https://developer.mozilla.org/en-US/play 코드 참고
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
  if (fileInput.files.length === 0) {
    console.log("No file selected or file was deselected.");
    imgPrevEl.style.backgroundImage = ""; // 이미 선택된 이미지 제거
    return; // 파일 선택이 없는 경우 early return
  }

  const selectedFile = fileInput.files[0];
  if (selectedFile) {
    addListeners(reader);
    reader.readAsDataURL(selectedFile);
  }
}

fileInput.addEventListener("change", handleSelected);

// 회원가입 텍스트 폼 유효성 검사
let check = {
  email: false,
  password: false,
  checkPassword: false,
  nickname: false,
};

formEl.addEventListener("input", (event) => {
  if (event.target.id === "email") {
    check.email = emailCheck(event.target.value);
  }
  if (event.target.id === "password") {
    check.password = pwdCheck(event.target.value);
  }
  if (event.target.id === "checkPassword") {
    check.checkPassword = pwdCheckSame(pwdEl.value, event.target.value);
  }
  if (event.target.id === "nickname") {
    check.nickname = nicknameCheck(event.target.value);
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

const emailCheck = (email) => {
  redEmailEl.classList.add("helper-text");
  const regex = /\w+@\w+\.\w+/;
  if (email.length === 0) {
    redEmailEl.textContent = "이메일을 입력해주세요";
    return false;
  } else if (!regex.test(email)) {
    redEmailEl.textContent = "올바른 이메일 주소 형식을 입력해주세요.";
    return false;
  } else {
    redEmailEl.textContent = "";
    redEmailEl.classList.remove("helper-text");
    return true;
  }
};

const pwdCheck = (pwd) => {
  redPwdEl.classList.add("helper-text");
  if (pwd.length === 0) {
    redPwdEl.textContent = "비밀번호를 입력해주세요";
    return false;
  } else if (pwd.length < 8 || pwd.length > 20) {
    redPwdEl.textContent = "비밀번호는 8자 이상 20자 이하여야 합니다.";
    return false;
  }
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
  if (!regex.test(pwd)) {
    redPwdEl.textContent =
      "비밀번호는 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    return false;
  } else {
    redPwdEl.textContent = "";
    redPwdEl.classList.remove("helper-text");
    return true;
  }
};

const pwdCheckSame = (pwd, pwdCheck) => {
  redPwdCheckEl.classList.add("helper-text");
  if (pwd !== pwdCheck) {
    redPwdCheckEl.textContent = "비밀번호가 일치하지 않습니다.";
    return false;
  } else {
    redPwdCheckEl.textContent = "";
    redPwdCheckEl.classList.remove("helper-text");
    return true;
  }
};

const nicknameCheck = (nickname) => {
  redNicknameEl.classList.add("helper-text");
  // 닉네임 정규 표현식: 띄어쓰기 없이 모든 문자 허용, 최대 10자
  const regex = /^[^\s]{1,10}$/;

  if (nickname.length === 0) {
    redNicknameEl.textContent = "닉네임을 입력해주세요";
    return false;
  } else if (!regex.test(nickname)) {
    redNicknameEl.textContent =
      "닉네임은 띄어쓰기 없이 최대 10자까지 가능합니다";
    return false;
  } else {
    redNicknameEl.textContent = "";
    redNicknameEl.classList.remove("helper-text");
    return true;
  }
};
