// 헤더 프로필 팝업 메뉴
const profileEl = document.querySelector(".profile");
const menuEl = document.querySelector(".menu");
const logoutEl = document.querySelector(".menu .logout");
const profileImgEl = document.querySelector("header div.profile div");

// 프로필 이미지  가져오기
export const getProfileImg = async () => {
  if (userData) {
    console.log("cached data");
    return userData; // 이미 데이터가 있으면 캐시된 데이터 반환
  }
  console.log("not cached data1");
  const response = await fetch(`http://localhost:4000/users/profile`, {
    method: "GET",
    credentials: "include", // 쿠키를 요청과 함께 보내도록 설정
  });
  if (response.status === 200) {
    const data = await response.json();
    const profileLink = `http://localhost:4000/profile/${data.profileImagePath
      .split("/")
      .pop()}`;
    console.log(profileLink);
    profileImgEl.style.backgroundImage = `url('${profileLink}')`;
    return data;
  }
};

// 페이지 로드 시 프로필 이미지 가져오기
document.addEventListener("DOMContentLoaded", getProfileImg);

// 메뉴 클릭 시 이벤트
profileEl.addEventListener("click", () => {
  menuEl.classList.toggle("click");
});

// 로그아웃 클릭 시
logoutEl.addEventListener("click", async () => {
  console.log("logout");
  const response = await fetch(`http://localhost:4000/users/logout`, {
    method: "GET",
    credentials: "include", // 쿠키를 요청과 함께 보내도록 설정
  });
  if (response.status === 200) {
    location.href = "/";
  }
});
