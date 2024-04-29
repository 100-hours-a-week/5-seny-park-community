import { formatDate, changeNum } from "/js/utils.js";
const postsContainer = document.querySelector(".posts");

// fetch로 json 파일 불러오기
const posts = [];
// 얘는 미리받아와도 된다
fetch("http://localhost:4000/posts")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    data.forEach((post) => {
      posts.push({
        post_id: post.post_id,
        title: post.post_title,
        content: post.post_content,
        like: post.like,
        comment_cnt: post.comments ? post.comments.length : 0,
        hit: post.hits,
        date: formatDate(post.created_at),
        author: post.nickname,
        profile: post.profileImagePath,
      });
    });
    console.log(posts.length);
    render();
  });

const render = () => {
  if (posts.length) {
    console.log(1);
    postsContainer.innerHTML = ""; // 게시글 초기화
    posts.forEach((post) => {
      // 게시글 제목 26글자 이내
      const postDiv = document.createElement("div");
      postDiv.className = "post";
      const url = `/main/post?post_id=${post.post_id}`;
      postDiv.innerHTML = `
    <a href="${url}">
      <div class="content one">
      <h2>${post.title.substring(0, 26)}</h2>
        <div class="texts">
          <div class="left">
            <p>좋아요 ${changeNum(post.like)}</p>
            <p>댓글 ${changeNum(post.comment_cnt)}</p>
            <p>조회수 ${changeNum(post.hit)}</p>
          </div>
          <div class="right">
            <p>${post.date}</p>
          </div>
        </div>
      </div>
      <div class="writer">
        <div class="img" style="background-image: url('${
          post.profile
        }');"></div>
        <div class="name">${post.author}</div>
      </div>
  </a>
    `;
      postsContainer.appendChild(postDiv);
    });
  }
};
