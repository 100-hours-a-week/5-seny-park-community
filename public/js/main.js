// content 제목
// const titleEls = document.querySelectorAll(".post .content.one h2");
// titleEls.forEach((titleEl) => {
//   console.log(titleEl.value);
//   if (titleEl.value.length > 26) {
//     console.log(titleEl.value);
//     titleEl.textContent = titleEl.textContent.slice(0, 26) + "...";
//   }
// });
const titleEl = document.querySelector(".post .content.one h2");

console.log(titleEl.textContent);
if (titleEl.textContent.length > 26) {
  titleEl.textContent = titleEl.textContent.slice(0, 26);
}
