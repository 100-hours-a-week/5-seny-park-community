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
const commentEl = document.querySelector(".write-comment"); // form textarea
const commentBtn = document.querySelector(".inner .makeComment .btn button"); // 댓글 등록 버튼
const modiCoBtn = document.querySelector(".comments .modi");
const delCoBtn = document.querySelector(".comments .del");
const cancelCoBtn = document.querySelector(".shadow-comment .cancel");
const confirmCoBtn = document.querySelector(".shadow-comment .delete");
const formEl = document.querySelector("form");

const commentEditEl = document.querySelector(".comment.active");

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

// 댓글 수정 버튼 클릭 시 댓글 입력창에 댓글 내용 추가되고 수정 버튼 value값은 댓글 수정으로 바뀐다.
// 클릭된 commentsEl 요소 안에 댓글 내용 요소인 div 수정버튼(.modi) 클릭 시 .comments의 댓글내용인 .comments .comment의 내용을 가져와서 commentEl에 넣어준다.
modiCoBtn.addEventListener("click", () => {
  console.log(commentEditEl.textContent);
  commentEl.value = commentEditEl.textContent;
  commentBtn.textContent = "댓글 수정";
  commentBtn.classList.add("modi");
  commentEl.focus();
});

// 댓글 수정 버튼 클릭 시 댓글 수정 버튼이 댓글 등록 버튼으로 바뀐다.
commentBtn.addEventListener("click", () => {
  if (commentBtn.classList.contains("modi")) {
    commentBtn.textContent = "댓글 등록";
    commentBtn.classList.remove("modi");
  }
});
