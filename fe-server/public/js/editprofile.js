import {
  setupModalToggle,
  ProfileImgCheck,
  nicknameCheck,
  handleSelected,
} from "/js/utils.js";
const userContainer = document.querySelector(".inner");

const userId = 1; // 현재 로그인한 사용자의 id 임의로 설정
// fetch로 json 파일 불러오기
fetch(`http://localhost:4000/users/editprofile`),
  {
    credentials: "include", // 쿠키를 요청과 함께 보내도록 설정
  }
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      renderPost(data, userContainer);
      afterRender();
    });

const renderPost = (userData, container) => {
  const profileLink =
    "http://localhost:4000/profile/" +
    userData.profileImagePath.split("/").pop();
  console.log(profileLink);
  container.innerHTML = `
    <h2>회원정보 수정</h2>
        <form
          method="post" 
          id="edit-form"
          class="inputs"
          enctype="multipart/form-data"
        >
          <div class="imgContainer">
            <div class="left">
              <p class="profile">프로필 사진*</p>
              <div class="red img"></div>
            </div>
            <div class="imgBox">
              <!-- label로 묶어 파일 인풋 가능하도록. id값으로 연결 -->
              <label for="profileUpload" class="file-upload-label">
              <div class="mid" style="background-image: url('${profileLink}')"><div class="file editbtn">변경</div></div>
              </label>
              <!-- display: none -->
              <input type="file" id="profileUpload" name="profilePicture" />
            </div>
          </div>
          <div class="textContainer">
            <div class="inputs">
              <div class="input">
                이메일
                <div class="email">${userData.email}</div>
              </div>

              <label for="nickname" class="input">
                닉네임
                <div>
                  <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    placeholder="닉네임을 입력하세요"
                    value="${userData.nickname}"
                  />
                  <div class="red nickname"></div>
                </div>
              </label>
              <div class="input-btn">
                <button type="submit" form="edit-form" class="btn profile">
                  수정하기
                </button>
              </div>
            </div>
          </div>
        </form>
        <div class="link">
          <a class="delete" href=" ">회원 탈퇴</a>
        </div>
        <div class="completeBtn">
          <div class="btn-toast toast">수정완료</div>
        </div>
    `;
};

const afterRender = () => {
  // 이미지 수정
  const fileInput = document.querySelector("#profileUpload"); // input[type="file"] - display:none
  const imgPrevEl = document.querySelector(".mid"); // img 보이는 태그
  const redImgEl = document.querySelector(".red.img"); // 이미지 업로드 경고문
  const fileSelectBtn = document.querySelector(".file.editbtn"); // 파일 선택 버튼
  let clickCount = 0; // 파일 선택 버튼 클릭 횟수 저장
  // 수정하기 버튼 클릭 시 토스트 페이지 이벤트
  const toastEl = document.querySelector(".toast");

  fileSelectBtn.addEventListener("click", () => {
    clickCount++; // 파일 선택 버튼 클릭 횟수 증가
  });

  // 이미지 업로드
  fileInput.addEventListener("change", () => {
    handleSelected(fileInput, imgPrevEl);
  });

  // 닉네임 수정
  const formEl = document.querySelector("form");
  const redNicknameEl = document.querySelector(".red.nickname");

  formEl.addEventListener("input", (event) => {
    if (event.target.id === "nickname") {
      nicknameCheck(event.target.value, redNicknameEl);
    }
    if (event.target.id === "profileUpload") {
      handleSelected(fileInput, imgPrevEl, redImgEl);
    }
  });

  let check = {
    profileImage: true,
    nickname: false,
  };

  formEl.addEventListener("submit", async (event) => {
    event.preventDefault(); // submit 기본 이벤트(새로고침) 막기
    check.profileImage = ProfileImgCheck(imgPrevEl, redImgEl); // 이미지 체크(업로드 여부
    check.nickname = nicknameCheck(
      formEl.elements.nickname.value,
      redNicknameEl
    );

    if (check.profileImage && check.nickname) {
      const formData = new FormData(formEl);
      formData.append("click", clickCount); // 클릭 횟수를 formData에 추가
      const response = await fetch(`http://localhost:4000/users/editprofile`, {
        method: "POST",
        body: formData,
        credentials: "include", // 쿠키를 요청과 함께 보내도록 설정
      });
      console.log(response);
      const data = await response.json();
      if (data.nicknameExists) {
        redNicknameEl.textContent = "중복된 닉네임입니다.";
      }
      if (response.status === 201) {
        // 토스트 el 나타남
        toastEl.classList.add("active");
        setTimeout(() => {
          // 1초 후 토스트 el 사라짐
          toastEl.classList.remove("active");
        }, 1000);
      }
    }
  });

  // 회원탈퇴 모달 팝업 이벤트
  const bodyEl = document.querySelector("body");
  const delEl = document.querySelector(".link .delete");
  const modalProfileEl = document.querySelector(".shadow-profile");
  const cancelProfileBtn = document.querySelector(".shadow-profile .cancel");
  const confirmProfileBtn = document.querySelector(".shadow-profile .delete");

  setupModalToggle(delEl, modalProfileEl, bodyEl);
  setupModalToggle(cancelProfileBtn, modalProfileEl, bodyEl);
  setupModalToggle(confirmProfileBtn, modalProfileEl, bodyEl, "/");
};
