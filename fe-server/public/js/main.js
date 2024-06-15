import { formatDate, changeNum } from "/js/utils.js";
const postsContainer = document.querySelector(".posts");

// 얘는 미리받아와도 된다
// fetch로 json 파일 불러오기
fetch("http://localhost:4000/posts", {
  credentials: "include", // 쿠키를 요청과 함께 보내도록 설정
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    render(data);
  });

const render = (data) => {
  if (data.length) {
    console.log(1);
    const postElements = data
      .map((post) => {
        const url = `/main/post?post_id=${post.post_id}`;

        return `
          <div class="post">
            <a href="${url}">
              <div class="content one">
                <h2>${post.post_title.substring(0, 26)}</h2>
                <div class="texts">
                  <div class="left">
                    <p>좋아요 ${changeNum(post.likes)}</p>
                    <p>댓글 ${changeNum(post.comments)}</p>
                    <p>조회수 ${changeNum(post.hits)}</p>
                  </div>
                  <div class="right">
                    <p>${formatDate(post.created_at)}</p>
                  </div>
                </div>
              </div>
              <div class="writer">
                <div class="img" style="background-image: url('${
                  post.profile_image.replace("/images", "") // '/images' 제거
                }');"></div>
                <div class="name">${post.nickname}</div>
              </div>
            </a>
          </div>
        `;
      })
      .join("");
    postsContainer.innerHTML = postElements;
  }
};
