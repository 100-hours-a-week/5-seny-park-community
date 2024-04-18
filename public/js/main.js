const titleEl = document.querySelector(".post .content.one h2");

console.log(titleEl.textContent);
if (titleEl.textContent.length > 26) {
  titleEl.textContent = titleEl.textContent.slice(0, 26);
}
