// 제목
const titleEl = document.querySelector(".input input.content");
// 이미지 업로드
const imgPrevEl = document.querySelector(".upload-img");
const fileInput = document.querySelector(".fileinput");
const reader = new FileReader(); // 파일 읽기 객체

// 제목 26글자 이내
titleEl.addEventListener("input", () => {
  console.log(titleEl.value, titleEl.value.length);
  if (titleEl.value.length > 26) {
    titleEl.value = titleEl.value.slice(0, 26);
  }
});

// 이미지 업로드
function handleEvent(event) {
  if (event.type === "load") {
    imgPrevEl.textContent = "";
    imgPrevEl.classList.add("active");
    imgPrevEl.src = reader.result; // imgPrevEl.style.backgroundImage = `url(${reader.result})`; // .mid 태그에 이미지 삽입

    // console.log("url:", reader.result);
    // https://developer.mozilla.org/en-US/zdocs/Web/API/FileReader/load_event 코드 참고
  }
}

function addListeners(reader) {
  reader.addEventListener("loadstart", handleEvent);
  reader.addEventListener("load", handleEvent);
  reader.addEventListener("loadend", handleEvent);
  reader.addEventListener("progress", handleEvent);
  reader.addEventListener("error", handleEvent);
  reader.addEventListener("abort", handleEvent);
}

function handleSelected(e) {
  // 파일 선택 시
  if (fileInput.files.length === 0) {
    // 파일 선택이 없는 경우
    console.log("No file selected or file was deselected.");
    imgPrevEl.classList.remove("active"); // 이미 선택된 이미지 제거
    imgPrevEl.src = "";
    return; // 파일 선택이 없는 경우 early return
  }

  const selectedFile = fileInput.files[0];
  if (selectedFile) {
    addListeners(reader);
    reader.readAsDataURL(selectedFile);
  }
}

fileInput.addEventListener("change", handleSelected);
