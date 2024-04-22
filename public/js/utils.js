// 사진 파일 업로드 합수
export const reader = new FileReader(); // 파일 읽기 객체
export const handleEvent = (event, imgPrev, redImgEl) => {
  if (event.type === "load") {
    console.log(imgPrev.tagName);
    setImageContent(imgPrev, event.target.result, redImgEl);
    console.log("Image URL:", event.target.result);
  }
};

export const addListeners = (reader, imgPrev, redImgEl) => {
  const events = ["loadstart", "load", "loadend", "progress", "error", "abort"];
  events.forEach((eventType) => {
    reader.addEventListener(eventType, (event) =>
      handleEvent(event, imgPrev, redImgEl)
    );
  });
  console.log("Listeners added");
};

export const handleSelected = (fileInput, imgPrev, redImgEl = null) => {
  const files = fileInput.files;
  console.log(imgPrev.tagName);
  if (files.length === 0) {
    console.log("No file selected or file was deselected.");
    clearImageContent(imgPrev, redImgEl); // 이미 선택된 이미지 제거
    return; // 파일 선택이 없는 경우 early return
  }

  const selectedFile = fileInput.files[0];
  if (selectedFile) {
    console.log(imgPrev);
    addListeners(reader, imgPrev, redImgEl);
    reader.readAsDataURL(selectedFile);
  }
};

export const setImageContent = (imgPrev, imageData, redImgEl) => {
  // 이미지 파일을 img 태그에 삽입
  if (redImgEl) redImgEl.textContent = ""; // 경고문 제거

  if (imgPrev.tagName === "IMG") {
    console.log(imgPrev.src);
    imgPrev.src = imageData;
    imgPrev.classList.add("active");
  } else {
    imgPrev.style.backgroundImage = `url(${imageData})`;
  }
};

export const clearImageContent = (imgPrev, redImgEl) => {
  // 이미지 파일을 img 태그에서 제거
  if (redImgEl) redImgEl.textContent = "프로필 사진을 추가해주세요.";
  console.log(imgPrev);
  if (imgPrev.tagName === "IMG") {
    imgPrev.src = "";
    imgPrev.classList.remove("active");
  } else {
    imgPrev.style.backgroundImage = "";
  }
};
///////////////////////////////////////////////////////////////
// 게시글 작성/편집 게시글 내용
// export const titleEl = document.querySelector(".input input.content");
// // 이미지 업로드
// export const imgPrevEl = document.querySelector(".upload-img");
// export const fileInput = document.querySelector(".fileinput");
// // 파일 읽기 객체 reader 는 위에서 선언

// 제목 26글자 이내
export const handleTitleInput = (titleEl) => {
  if (titleEl.value.length > 26) {
    titleEl.value = titleEl.value.slice(0, 26);
  }
};

///////////////////////////////////////////////////////////////
// 유효성 검사 함수

export const ProfileImgCheck = (imgPrev, redImgEl) => {
  if (imgPrev.style.backgroundImage === "") {
    redImgEl.textContent = "프로필 사진을 추가해주세요.";
    return false;
  } else {
    return true;
  }
};

export const emailCheck = (email, redEmailEl) => {
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

///////////////////////////////////////////////////////////////
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

///////////////////////////////////////////////////////////////
// 시간 포맷 함수 (yyyy-mm-dd hh:mm:ss)
export const formatDate = (strDate) => {
  const date = new Date(strDate); // Convert string to Date object
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();

  // 한 자리 수일 때 앞에 0을 붙여주기
  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;
  hour = hour < 10 ? `0${hour}` : hour;
  minute = minute < 10 ? `0${minute}` : minute;
  second = second < 10 ? `0${second}` : second;

  // 포맷된 문자열을 구성
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

///////////////////////////////////////////////////////////////
export const postRules = (titleEl, imgPrev, fileInput) => {
  // 제목 26글자 이내
  titleEl.addEventListener("input", handleTitleInput(titleEl));
  // 이미지 업로드
  fileInput.addEventListener("change", () => {
    handleSelected(fileInput, imgPrev);
  });
};
