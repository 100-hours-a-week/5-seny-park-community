import { setupModalToggle, nicknameCheck, handleSelected } from "/js/utils.js";
const userContainer = document.querySelector(".inner");

const userId = 1; // 현재 로그인한 사용자의 id 임의로 설정
// fetch로 json 파일 불러오기
fetch(`http://localhost:4000/users/editprofile`)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    renderPost(data, userContainer);
    afterRender();
  });

function renderPost(userData, container) {
  console.log(userData.profileImagePath);
  container.innerHTML = `
    <h2>회원정보 수정</h2>
        <form
          method="post" 
          id="edit-form"
          class="inputs"
        >
          <div class="imgContainer">
            <div class="left">
              <p class="profile">프로필 사진*</p>
            </div>
            <div class="imgBox">
              <!-- label로 묶어 파일 인풋 가능하도록. id값으로 연결 -->
              <label for="profileUpload" class="file-upload-label">
              <div class="mid" style="background-image: url('${userData.profileImagePath}')"><div class="editbtn">변경</div></div>
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
}

const afterRender = () => {
  // 이미지 수정
  const fileInput = document.querySelector("#profileUpload"); // input[type="file"] - display:none
  const imgPrevEl = document.querySelector(".mid"); // img 보이는 태그
  // 수정하기 버튼 클릭 시 토스트 페이지 이벤트
  const toastEl = document.querySelector(".toast");

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
  });

  let check = {
    nickname: false,
  };

  formEl.addEventListener("submit", async (event) => {
    event.preventDefault(); // submit 기본 이벤트(새로고침) 막기
    check.nickname = nicknameCheck(
      formEl.elements.nickname.value,
      redNicknameEl
    );

    if (check.nickname) {
      const response = await fetch(`http://localhost:4000/users/editprofile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: formEl.elements.nickname.value,
        }),
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
