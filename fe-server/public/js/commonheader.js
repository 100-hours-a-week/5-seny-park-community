// 헤더 프로필 팝업 메뉴
const profileEl = document.querySelector(".profile");
const menuEl = document.querySelector(".menu");
const logoutEl = document.querySelector(".menu .logout");

// 메뉴 클릭 시 이벤트
profileEl.addEventListener("click", () => {
  menuEl.classList.toggle("click");
});

// 로그아웃 클릭 시
logoutEl.addEventListener("click", async () => {
  const response = await fetch(`http://localhost:4000/users/logout`, {
    method: "GET",
    credentials: "include", // 쿠키를 요청과 함께 보내도록 설정
  });
  if (response.status === 200) {
    location.href = "/";
  }
});
