// 헤더 프로필 팝업 메뉴
const profileEl = document.querySelector(".profile");
const menuEl = document.querySelector(".menu");

// 메뉴 클릭 시 이벤트
profileEl.addEventListener("click", () => {
  menuEl.classList.toggle("click");
});
