import { postRules } from "./utils.js";
// 게시글 작성/편집 게시글 내용
const titleEl = document.querySelector(".input input.content");
const contentEl = document.querySelector(".input textarea.content2");
// 이미지 업로드
const imgPrevEl = document.querySelector(".upload-img");
const fileInput = document.querySelector(".fileinput");
// 유효성검사
const formEl = document.querySelector("#makepost-form"); // Form element
const submitBtn = document.querySelector(".btn.purple-btn"); // Submit button for the form
const redEl = document.querySelector(".red"); // Element to display validation messages
// 제목 26글자 이내, 이미지 업로드
postRules(titleEl, imgPrevEl, fileInput);

// title, content 유효성 검사
const postCheck = (titleEl, contentEl, redEl) => {
  if (titleEl.value.length === 0 || contentEl.value.length === 0) {
    redEl.textContent = "제목과 내용을 입력해주세요";
    return false;
  } else {
    redEl.textContent = "";
    return true;
  }
};

let check = false;
formEl.addEventListener("input", (event) => {
  if (event.target.id === "content" || event.target.id === "title") {
    check = postCheck(formEl.elements.title, formEl.elements.content, redEl);
  }
  if (check) {
    console.log(titleEl.value, contentEl.value);
    submitBtn.classList.add("active");
  } else {
    submitBtn.classList.remove("active");
  }
});

formEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  check = postCheck(formEl.elements.title, formEl.elements.content, redEl);
  if (check) {
    const formData = new FormData(formEl);
    const response = await fetch(`http://localhost:4000/posts/createpost`, {
      method: "POST",
      body: formData,
      credentials: "include", // 쿠키를 요청과 함께 보내도록 설정
    });
    console.log(response);
    if (response.status === 201) {
      alert("게시글이 등록되었습니다.");
      location.href = `/main`;
    } else if (response.status === 500) {
      alert("게시글 등록에 실패했습니다.");
    }
  }
});
