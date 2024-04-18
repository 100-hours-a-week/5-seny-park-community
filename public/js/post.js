// 게시글 수정 삭제 버튼
const modiBtn = document.querySelector(".title .modi");
const delBtn = document.querySelector(".title .del");
// 게시글 삭제 버튼 클릭 시 모달 팝업
const cancelBtn = document.querySelector(".modal .cancel");
const confirmBtn = document.querySelector(".modal .delete");
const bodyEl = document.querySelector("body");
const modalPostEl = document.querySelector(".shadow-post");
const modalCommentEl = document.querySelector(".shadow-comment");
// 댓글 창
const commentEl = document.querySelector(".write-comment");
const commentBtn = document.querySelector(".inner .makeComment .btn button");
const modiCoBtn = document.querySelector(".comments .modi");
const delCoBtn = document.querySelector(".comments .del");
const cancelCoBtn = document.querySelector(".shadow-comment .cancel");
const confirmCoBtn = document.querySelector(".shadow-comment .delete");

// 모달 제어 함수 ( isOpening 값은 boolean)
const toggleModal = (isOpening, modalElement) => {
  bodyEl.classList.toggle("popClick", isOpening);
  modalElement.classList.toggle("popClick", isOpening);
};

// 이벤트 리스너 설정 함수
const setupModalToggle = (triggerEl, modalEl, redirect = false) => {
  triggerEl.addEventListener("click", (event) => {
    event.preventDefault();
    if (redirect) {
      toggleModal(false, modalEl);
      location.href = "/html/main.html";
    } else {
      const isOpening = !modalEl.classList.contains("popClick"); // 모달이 열려있는지 확인
      toggleModal(isOpening, modalEl);
    }
  });
};

// 게시글 및 댓글 모달 이벤트 리스너 설정
setupModalToggle(delBtn, modalPostEl);
setupModalToggle(delCoBtn, modalCommentEl);
setupModalToggle(cancelBtn, modalPostEl);
setupModalToggle(cancelCoBtn, modalCommentEl);
setupModalToggle(confirmBtn, modalPostEl, true);
setupModalToggle(confirmCoBtn, modalCommentEl);

// delBtn.addEventListener("click", (event) => {
//   event.preventDefault();
//   bodyEl.classList.add("popClick");
//   modalPostEl.classList.add("popClick");
// });

// delCoBtn.addEventListener("click", (event) => {
//   event.preventDefault();
//   bodyEl.classList.add("popClick");
//   modalCommentEl.classList.add("popClick");
// });

// cancelBtn.addEventListener("click", (event) => {
//   event.preventDefault();
//   bodyEl.classList.remove("popClick");
//   modalPostEl.classList.remove("popClick");
// });

// cancelCoBtn.addEventListener("click", (event) => {
//   event.preventDefault();
//   bodyEl.classList.remove("popClick");
//   modalCommentEl.classList.remove("popClick");
// });

// confirmBtn.addEventListener("click", (event) => {
//   event.preventDefault();
//   bodyEl.classList.remove("popClick");
//   modalPostEl.classList.remove("popClick");
//   location.href = "/html/main.html"; // 삭제 후 메인 페이지로 이동
// });

// confirmCoBtn.addEventListener("click", (event) => {
//   event.preventDefault();
//   bodyEl.classList.remove("popClick");
//   modalCommentEl.classList.remove("popClick");
// });

// // 댓글 입력 시 버튼 색 변경
// commentEl.addEventListener("input", () => {
//   if (commentEl.value.length > 0) {
//     commentBtn.classList.add("active");
//   } else {
//     commentBtn.classList.remove("active");
//   }
// });
