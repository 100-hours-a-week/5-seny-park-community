import { setupModalToggle } from "/js/utils.js";

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

// 게시글 및 댓글 모달 이벤트 리스너 설정
setupModalToggle(delBtn, modalPostEl, bodyEl);
setupModalToggle(delCoBtn, modalCommentEl, bodyEl);
setupModalToggle(cancelBtn, modalPostEl, bodyEl);
setupModalToggle(cancelCoBtn, modalCommentEl, bodyEl);
setupModalToggle(confirmBtn, modalPostEl, bodyEl, "/html/main.html");
setupModalToggle(confirmCoBtn, modalCommentEl, bodyEl);

// 댓글 입력 시 버튼 색 변경
commentEl.addEventListener("input", () => {
  if (commentEl.value.length > 0) {
    commentBtn.classList.add("active");
  } else {
    commentBtn.classList.remove("active");
  }
});
