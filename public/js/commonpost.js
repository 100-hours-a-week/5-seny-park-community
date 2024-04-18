import {
  handleSelected,
  handleTitleInput,
  imgPrevEl,
  fileInput,
  titleEl,
} from "/js/utils.js";

// 제목 26글자 이내
titleEl.addEventListener("input", handleTitleInput);

// 이미지 업로드
fileInput.addEventListener("change", () => {
  handleSelected(fileInput, imgPrevEl);
});
