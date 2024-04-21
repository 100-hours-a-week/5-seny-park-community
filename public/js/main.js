const postsContainer = document.querySelector(".posts");

// fetch로 json 파일 불러오기
const posts = [];
fetch("/json/posts.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    data.forEach((post) => {
      posts.push({
        title: post.post_title,
        content: post.post_content,
        like: post.like,
        comment_cnt: post.comment_count,
        hit: post.hits,
        date: formatDate(post.created_at),
        author: post.nickname,
        profile: post.profileImagePath,
      });
    });
    console.log(posts.length);
    render();
  });

const formatDate = (strDate) => {
  const date = new Date(strDate); // Convert string to Date object
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();

  // 한 자리 수일 때 앞에 0을 붙여주기
  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;
  hour = hour < 10 ? `0${hour}` : hour;
  minute = minute < 10 ? `0${minute}` : minute;
  second = second < 10 ? `0${second}` : second;

  // 포맷된 문자열을 구성
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

const render = () => {
  if (posts.length) {
    console.log(1);
    postsContainer.innerHTML = ""; // 게시글 초기화
    posts.forEach((post) => {
      // 게시글 제목 26글자 이내
      const postDiv = document.createElement("div");
      postDiv.className = "post";
      postDiv.innerHTML = `
    <a href="./post.html">
      <div class="content one">
      <h2>${post.title.substring(0, 26)}</h2>
        <div class="texts">
          <div class="left">
            <p>좋아요 ${post.like}</p>
            <p>댓글 ${post.comment_cnt}</p>
            <p>조회수 ${post.hit}</p>
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
