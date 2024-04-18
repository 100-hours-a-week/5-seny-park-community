import { handleSelected, handleTitleInput } from "/js/utils.js";

// 제목
const titleEl = document.querySelector(".input input.content");
// 이미지 업로드
const imgPrevEl = document.querySelector(".upload-img");
const fileInput = document.querySelector(".fileinput");

// 제목 26글자 이내
titleEl.addEventListener("input", handleTitleInput);

// 이미지 업로드
fileInput.addEventListener("change", () => {
  console.log(imgPrevEl.src);
  console.log(imgPrevEl.tagName);
  handleSelected(fileInput, imgPrevEl);
});
