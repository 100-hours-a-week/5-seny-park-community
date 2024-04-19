import { setupModalToggle, nicknameCheck, handleSelected } from "/js/utils.js";

// 이미지 수정
const fileInput = document.querySelector("#profileUpload"); // input[type="file"] - display:none
const imgPrevEl = document.querySelector(".mid"); // img 보이는 태그
// 수정하기 버튼 클릭 시 토스트 페이지 이벤트
const toastEl = document.querySelector(".toast");

// 이미지 업로드
fileInput.addEventListener("change", () => {
  handleSelected(fileInput, imgPrevEl);
});

// 닉네임 수정
const formEl = document.querySelector("form");
const redNicknameEl = document.querySelector(".red.nickname");

formEl.addEventListener("input", (event) => {
  if (event.target.id === "nickname") {
    nicknameCheck(event.target.value, redNicknameEl);
  }
});

let check = {
  nickname: false,
};

formEl.addEventListener("submit", (event) => {
  console.log("submit");
  event.preventDefault(); // submit 기본 이벤트(새로고침) 막기
  check.nickname = nicknameCheck(formEl.elements.nickname.value, redNicknameEl);

  if (check.nickname) {
    // formEl.submit();
    toastEl.classList.add("active");
    setTimeout(() => {
      // 1초 후 토스트 el 사라짐
      toastEl.classList.remove("active");
    }, 1000);
  }
});

// 회원탈퇴 모달 팝업 이벤트
const bodyEl = document.querySelector("body");
const delEl = document.querySelector(".link .delete");
const modalProfileEl = document.querySelector(".shadow-profile");
const cancelProfileBtn = document.querySelector(".shadow-profile .cancel");
const confirmProfileBtn = document.querySelector(".shadow-profile .delete");

setupModalToggle(delEl, modalProfileEl, bodyEl);
setupModalToggle(cancelProfileBtn, modalProfileEl, bodyEl);
setupModalToggle(confirmProfileBtn, modalProfileEl, bodyEl, "/");
