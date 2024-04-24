import { postRules } from "./utils.js";
const postContainer = document.querySelector(".inner");

//  fetch로 json 파일 불러오기
fetch("/json/posts.json")
  .then((response) => response.json())
  .then((data) => {
    const postId = 7;
    if (data.length > 0) {
      console.log(data[postId - 1]);
      renderPost(data[postId - 1], postContainer);
      afterRender();
    }
  });

function renderPost(postData, container) {
  container.innerHTML = `
   <div class="h2Title">
    <h2>게시글 수정</h2>
  </div>
  
  <form
    method="post"
    action="/posts/edit"
    id="editpost-form"
    class="inputs"
  >
    <label class="input">
      <div class="title">제목*</div>
      <input
        type="text"
        class="content"
        name="postTitle"
        id="title"
        placeholder="제목을 입력해주세요. (최대 26글자)"
        value="${postData.post_title}"
      />
    </label>
    <label class="input">
      <div class="title">내용*</div>
      <textarea
        form="editpost-form"
        id="content"
        name="postContent"
        class="content2"
        placeholder="내용을 입력해주세요."
      >${postData.post_content} </textarea>
    </label>
    <div class="red"></div>
    <label for="postUpload" class="inputFile">
      <div class="title">이미지</div>
      <div class="fileLabel">
        <div class="btn">파일 선택</div>
        <div class="content3">파일을 선택해주세요.</div>
      </div>
      <img class="upload-img active" src=${postData.attach_file_path} alt="이미지 삽입" />
    </label>
    <input
      type="file"
      id="postUpload"
      name="postPicture"
      class="fileinput hidden"
    />
  </form>

  <button type="submit" form="editpost-form" class="btn purple-btn">완료</button>  
    `;
}

const afterRender = () => {
  // 게시글 작성/편집 게시글 내용
  const titleEl = document.querySelector(".input input.content");
  const contentEl = document.querySelector(".input textarea.content2");
  // 이미지 업로드
  const imgPrevEl = document.querySelector(".upload-img");
  const fileInput = document.querySelector(".fileinput");
  // 유효성검사
  const formEl = document.querySelector("#editpost-form"); // Form element
  const submitBtn = document.querySelector(".btn.purple-btn"); // Submit button for the form
  const redEl = document.querySelector(".red"); // Element to display validation messages

  // 제목 26글자 이내, 이미지 업로드
  postRules(titleEl, imgPrevEl, fileInput);
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

  formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    check = postCheck(formEl.elements.title, formEl.elements.content, redEl);
    if (check) {
      formEl.submit();
    }
  });
};
