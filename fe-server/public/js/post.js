import { getProfileImg } from "./commonheader.js";
import { formatDate, setupModalToggle, changeNum } from "/js/utils.js";

const postContainer = document.querySelector(".inner");

// main.js에서 클릭한 게시글의 post_id를 url에서 가져온다.
const postId = new URLSearchParams(window.location.search).get("post_id");
console.log(postId);

// 페이지 로드 시 프로필 이미지 및 사용자 정보 가져오기
document.addEventListener("DOMContentLoaded", async () => {
  const user = await getProfileImg(); // getProfileImg 함수가 완료될 때까지 기다림
  console.log(user.user_id, user.nickname);
  fetchPostData(user); // getProfileImg 완료 후 fetchPostData 실행
});

const fetchPostData = async (user) => {
  fetch(`http://localhost:4000/posts/${postId}`, {
    credentials: "include", // 쿠키를 요청과 함께 보내도록 설정
  })
    .then((response) => {
      if (!response.ok && response.status === 401) {
        // Unauthorized, 사용자가 로그인되지 않음
        alert("로그인을 해주세요.");
        window.location.href = "/"; // 홈이나 로그인 페이지로 리다이렉션
        return;
      }
      return response.json();
    })
    .then((data) => {
      renderPost(data.post, postContainer, user);
      if (data.comments.length > 0) {
        renderComments(data.comments, user);
      }
      afterRender(data);
    })
    .catch((error) => {
      console.error(
        "데이터를 불러오는 중에 오류가 발생했습니다:",
        error.message
      );
    });
};

const renderPost = (postData, container, user) => {
  let postImgLink = "";
  console.log(postData.post_image);
  if (postData.post_image && postData.post_image !== "http://localhost:4000/") {
    postImgLink = `http://localhost:4000/post/${postData.post_image
      .split("/")
      .pop()}`;
  }
  container.innerHTML = `
    <div class="title">
      <h2>${postData.post_title}</h2>
      <div class="control">
        <div class="writer">
          <div class="img"><div style="background-image: url('${
            postData.profile_image.replace("/images", "") // '/images' 제거
          }');"></div></div>
          <div class="name">${postData.nickname}</div>
          <div class="date">${formatDate(postData.created_at)}</div>
        </div>
        
        <div class="controlBtns ${
          postData.user_id === user.user_id ? "active" : ""
        }">
          <button class="modi">수정</a></button>
          <button class="del"><a href="#">삭제</a></button>
        </div>
      </div>
    </div>
    <div class="contents">
    ${
      postImgLink !== ""
        ? `<div class="img" style="background-image: url('${postImgLink}')"></div>`
        : ""
    }
    <div class="texts">${postData.post_content.replace(/\n/g, "<br>")}</div>
    </div>

    <div class="clickBtn">
      <button class="views">
        <p class="count">${changeNum(postData.hits)}</p>
        <p class="text">조회수</p>
      </button>
      <button class="comments">
        <p class="count">${changeNum(postData.comments)}</p>
        <p class="text">좋아요</p>
      </button>
    </div>
    <div class="makeComment">
    <form method="post" class="comment-form">
      <div class="box">
        <textarea
          class="write-comment"
          name="comment"
          placeholder="댓글을 남겨주세요!"
          required
        ></textarea>
        <div class="btn"><button>댓글 등록</button></div>
      </div>
    </form>
  </div>
    <div class="commentsList"></div>
  `;
};

const renderComments = (comments, user) => {
  const commentsList = document.querySelector(".commentsList");
  commentsList.innerHTML = comments
    .map(
      (comment) => `
  <div class="comments ${comment.comment_id}">
    <div class="left">
      <div class="top">
        <div class="img"><div style="background-image: url('${
          comment.profile_image.replace("/images", "") // '/images' 제거
        }');"></div></div>
        <div class="name">${comment.nickname}</div>
        <div class="date">${formatDate(comment.created_at)}</div>
      </div>
      <div class="bottom">
        <div class="comment active">${comment.comment}</div>
      </div>
    </div>
    <div class="right click">
    <div class="controlBtns ${
      user.user_id === comment.user_id ? "active" : ""
    }" >
      <button class="modi">수정</button>
      <button class="del">삭제</button>
      </div>
    </div>
  </div>
`
    )
    .join("");
};

const afterRender = (data) => {
  // 게시글 수정 삭제 버튼
  const modiBtn = document.querySelector(".title .modi");
  const delBtn = document.querySelector(".title .del");
  // 게시글 삭제 버튼 클릭 시 모달 팝업
  const cancelBtn = document.querySelector(".modal .cancel");
  const confirmBtn = document.querySelector(".modal .delete");
  const bodyEl = document.querySelector("body");
  const modalPostEl = document.querySelector(".shadow-post");
  const modalCommentEl = document.querySelector(".shadow-comment");
  // 댓글 창
  const commentEl = document.querySelector(".write-comment"); // form textarea
  const commentBtn = document.querySelector(".inner .makeComment .btn button"); // 댓글 등록 버튼
  // const modiCoBtn = document.querySelector(".comments .modi");
  // const delCoBtn = document.querySelector(".comments .del");
  const modiCoBtns = document.querySelectorAll(".comments .modi");
  const delCoBtns = document.querySelectorAll(".comments .del");
  const cancelCoBtn = document.querySelector(".shadow-comment .cancel");
  const confirmCoBtn = document.querySelector(".shadow-comment .delete");
  const commentEditEls = document.querySelectorAll(".comment.active");

  let commentId = undefined; // 수정할 댓글의 ID

  // 게시글 및 댓글 모달 이벤트 리스너 설정
  setupModalToggle(delBtn, modalPostEl, bodyEl);
  delCoBtns.forEach((btn) => {
    setupModalToggle(btn, modalCommentEl, bodyEl);
  });
  setupModalToggle(cancelBtn, modalPostEl, bodyEl);
  setupModalToggle(cancelCoBtn, modalCommentEl, bodyEl);
  setupModalToggle(confirmBtn, modalPostEl, bodyEl);
  setupModalToggle(confirmCoBtn, modalCommentEl, bodyEl);

  const commentForm = document.querySelector(".comment-form");
  let exist = false;

  // 댓글 등록/수정 요청
  commentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log(commentEl.value);
    fetch(`http://localhost:4000/posts/${postId}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        exist: exist,
        comment_id: commentId,
        comment_content: commentEl.value,
        created_at: new Date(),
      }),
      credentials: "include", // 쿠키를 요청과 함께 보내도록 설정
    }).then((response) => {
      const data = response.json();
      console.log(data);
      if (response.status === 403) {
        alert("댓글 수정 권한이 없습니다.");
        location.reload();
      }
      if (response.status === 201) {
        alert("댓글이 등록되었습니다.");
        // location.href = `/main/posts/?post_id=${postId}`;
        location.reload();
      }
      if (response.status === 204) {
        console.log(data);
        alert("댓글이 수정되었습니다.");
        location.reload();
        exist = false;
      }
    });
  });

  // 게시글 수정 버튼 클릭 시 게시글 수정 페이지로 이동
  modiBtn.addEventListener("click", (event) => {
    const editUrl = `/main/edit/post?post_id=${data.post.post_id}`;
    event.preventDefault(); // 기본 이벤트 방지
    console.log("click");

    // 서버에 수정 권한 확인 요청
    fetch(`http://localhost:4000/posts/edit/${postId}/permission`, {
      method: "GET",
      credentials: "include", // 쿠키를 요청과 함께 보내도록 설정
    })
      .then((response) => {
        console.log(111);
        if (response.status === 403) {
          console.log(403);
          alert("게시글 수정 권한이 없습니다.");
          location.reload(); // 페이지 새로고침
        } else if (response.status === 200) {
          console.log(200);
          window.location.href = editUrl; // 수정 페이지로 이동
        }
      })
      .catch((error) => {
        console.error("게시글 수정 요청 중 에러 발생: ", error);
        alert("게시글 수정 요청 중 문제가 발생했습니다.");
      });
  });

  // 댓글 입력 시 버튼 색 변경
  commentEl.addEventListener("input", () => {
    if (commentEl.value.length > 0) {
      commentBtn.classList.add("active");
    } else {
      commentBtn.classList.remove("active");
    }
  });

  // 댓글 수정 버튼 클릭 시 댓글 입력창에 댓글 내용 추가되고 수정 버튼 value값은 댓글 수정으로 바뀐다.
  // 클릭된 commentsEl 요소 안에 댓글 내용 요소인 div 수정버튼(.modi) 클릭 시 .comments의 댓글내용인 .comments .comment의 내용을 가져와서 commentEl에 넣어준다.
  modiCoBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const commentEditEl = commentEditEls[index];
      console.log(commentEditEl.textContent);
      commentEl.value = commentEditEl.textContent;
      commentBtn.textContent = "댓글 수정";
      commentBtn.classList.add("modi");
      commentEl.focus();
      exist = true;
      commentId = btn.closest(".comments").classList[1]; // 댓글의 ID가 클래스 리스트의 두 번째 항목에 있다고 가정
      console.log(commentId);
    });
  });

  // 댓글 삭제 버튼 클릭 시 해당하는 댓글의 ID를 가져와서 저장한다.
  delCoBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      commentId = btn.closest(".comments").classList[1];
    });
  });

  // 댓글 삭제 버튼 클릭시 등장하는 모달 팝업의 확인 버튼 클릭 시 댓글 삭제 요청 보내고, 삭제 성공 시 새로고침
  confirmCoBtn.addEventListener("click", () => {
    fetch(`http://localhost:4000/posts/${postId}/comment/${commentId}`, {
      method: "DELETE",
      credentials: "include",
    }).then((response) => {
      if (response.status === 403) {
        alert("댓글 삭제 권한이 없습니다.");
        location.reload();
      } else if (response.status === 204) {
        alert("댓글이 삭제되었습니다.");
        location.reload();
      } else {
        alert("댓글 삭제에 실패했습니다." + response.status);
      }
    });
  });

  // 게시글 삭제 버튼 클릭 시 등장하는 모달 팝업의 확인 버튼 클릭 시 게시글 삭제 요청 보내고, 삭제 성공 시 메인 페이지로 이동
  confirmBtn.addEventListener("click", () => {
    fetch(`http://localhost:4000/posts/${postId}`, {
      method: "DELETE",
      credentials: "include",
    }).then((response) => {
      if (response.status === 403) {
        alert("게시글 삭제 권한이 없습니다.");
        location.reload();
      } else if (response.status === 204) {
        alert("게시글이 삭제되었습니다.");
        location.href = "/main";
      } else {
        alert("게시글 삭제에 실패했습니다." + response.status);
      }
    });
  });

  // 댓글 수정 버튼 클릭 시 댓글 수정 버튼이 댓글 등록 버튼으로 바뀐다.
  commentBtn.addEventListener("click", () => {
    if (commentBtn.classList.contains("modi")) {
      commentBtn.textContent = "댓글 등록";
      commentBtn.classList.remove("modi");
    }
  });
};
