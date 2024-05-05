import { postRules } from "./utils.js";
const postContainer = document.querySelector(".inner");

//  fetch로 json 파일 불러오기
const postId = new URLSearchParams(window.location.search).get("post_id");
console.log(postId);
fetch(`http://localhost:4000/edit/posts/${postId}`)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    renderPost(data, postContainer);
    afterRender();
  });

function renderPost(postData, container) {
  container.innerHTML = `
   <div class="h2Title">
    <h2>게시글 수정</h2>
  </div>
  
  <form
    method="post" 
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
      ${
        postData.attach_file_path
          ? `<img src="${postData.attach_file_path}" class="upload-img active" />`
          : ""
      }
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

  // 게시글 작성/편집 게시글 post
  formEl.addEventListener("submit", async (event) => {
    event.preventDefault();
    let check = postCheck(
      formEl.elements.title,
      formEl.elements.content,
      redEl
    );
    if (check) {
      const response = await fetch(
        `http://localhost:4000/edit/posts/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: titleEl.value,
            content: contentEl.value.replace(/\n/g, "<br>"),
          }),
        }
      );
      console.log(response);
      if (response.status === 201) {
        alert("게시글이 수정되었습니다.");
        location.href = `/main/post?post_id=${postId}`;
      } else if (response.status === 500) {
        alert("게시글 수정에 실패했습니다.");
      }
    }
  });

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
};
