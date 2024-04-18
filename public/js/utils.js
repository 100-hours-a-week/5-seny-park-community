// 사진 파일 업로드 합수
export const reader = new FileReader(); // 파일 읽기 객체
export const handleEvent = (event, imgPrevEl) => {
  if (event.type === "load") {
    imgPrevEl.style.backgroundImage = `url(${event.target.result})`; // Use event.target.result
    console.log("Image URL:", event.target.result);
  }
};

export const addListeners = (reader, imgPrevEl) => {
  const events = ["loadstart", "load", "loadend", "progress", "error", "abort"];
  events.forEach((eventType) => {
    reader.addEventListener(eventType, (event) =>
      handleEvent(event, imgPrevEl)
    );
  });
  console.log("Listeners added");
};

export const handleSelected = (fileInput, imgPrevEl) => {
  const files = fileInput.files;
  if (files.length === 0) {
    console.log("No file selected or file was deselected.");
    imgPrevEl.style.backgroundImage = ""; // 이미 선택된 이미지 제거
    return; // 파일 선택이 없는 경우 early return
  }

  const selectedFile = fileInput.files[0];
  if (selectedFile) {
    addListeners(reader, imgPrevEl);
    reader.readAsDataURL(selectedFile);
  }
};

// 유효성 검사 함수
export const emailCheck = (email, redEmailEl) => {
  console.log(email);
  const regex = /\w+@\w+\.\w+/;
  if (email.length === 0) {
    redEmailEl.textContent = "이메일을 입력해주세요";
    return false;
  } else if (!regex.test(email)) {
    redEmailEl.textContent = "올바른 이메일 주소 형식을 입력해주세요.";
    return false;
  } else {
    redEmailEl.textContent = "";
    return true;
  }
};

export const pwdCheck = (pwd, redPwdEl) => {
  console.log(pwd, redPwdEl);
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
    return true;
  }
};

export const pwdCheckSame = (pwd, pwdCheck, redPwdCheckEl) => {
  if (pwd !== pwdCheck) {
    redPwdCheckEl.textContent = "비밀번호가 일치하지 않습니다.";
    return false;
  } else {
    redPwdCheckEl.textContent = "";
    return true;
  }
};

export const nicknameCheck = (nickname, redNicknameEl) => {
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
    return true;
  }
};

// 모달 제어 함수 ( isOpening 값은 boolean)
export const toggleModal = (isOpening, modalElement, bodyEl) => {
  bodyEl.classList.toggle("popClick", isOpening);
  modalElement.classList.toggle("popClick", isOpening);
};

// 이벤트 리스너 설정 함수
export const setupModalToggle = (
  triggerEl,
  modalEl,
  bodyEl,
  redirect = false
) => {
  triggerEl.addEventListener("click", (event) => {
    event.preventDefault();
    if (redirect) {
      toggleModal(false, modalEl, bodyEl);
      location.href = redirect; // 페이지 이동
    } else {
      const isOpening = !modalEl.classList.contains("popClick"); // 모달이 열려있는지 확인
      toggleModal(isOpening, modalEl, bodyEl);
    }
  });
};
