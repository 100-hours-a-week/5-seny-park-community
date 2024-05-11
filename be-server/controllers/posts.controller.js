const fs = require("fs");
const path = require("path");

const filePostsPath = path.join(__dirname, "../models/posts.model.json");

// 게시글 목록
const getPosts = (req, res) => {
  fs.readFile(filePostsPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("게시글 불러오기에 실패했습니다.");
    }
    const posts = JSON.parse(data);
    res.json(posts);
  });
};

// 게시글 상세 페이지
const getPost = (req, res) => {
  const postId = req.params.postId;
  fs.readFile(filePostsPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("게시글 불러오기에 실패했습니다.");
    }
    const posts = JSON.parse(data); // JSON 형식의 문자열을 객체로 변환
    const post = posts.find((post) => post.post_id === Number(postId));

    // 만약 post 객체가 존재하면 hits 속성을 증가시킵니다.
    if (post) {
      post.hits = Number(post.hits) + 1; // 조회수 증가
    }

    console.log(post);
    // 업데이트된 게시글 정보를 파일에 저장
    fs.writeFile(filePostsPath, JSON.stringify(posts, null, 2), (err) => {
      if (err) {
        return res.status(500).send("조회수 업데이트에 실패했습니다.");
      }

      res.json(post);
    });
  });
};

// 게시글 수정 페이지
const getEditPost = (req, res) => {
  const postId = req.params.postId;
  console.log(`PostId: ${postId}`);
  fs.readFile(filePostsPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("게시글 불러오기에 실패했습니다.");
    }
    const posts = JSON.parse(data);
    const post = posts.find((post) => post.post_id === Number(postId));
    res.json(post);
  });
};

// 게시글 수정 페이지 - 수정된 정보 저장
const postEditPost = (req, res) => {
  const postId = req.params.postId;
  console.log(req.body);
  const { postTitle, postContent, click } = req.body;
  console.log(`Title: ${postTitle}, Content: ${postContent}`);
  const postImg = req.file; // 이미지 파일 정보
  const postImgPath = postImg ? postImg.path : ""; // 이미지 파일 경로 설정
  fs.readFile(filePostsPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("게시글 불러오기에 실패했습니다.");
    }
    const posts = JSON.parse(data);
    const post = posts.find((post) => post.post_id === Number(postId));
    console.log(post);
    post.post_title = postTitle;
    post.post_content = postContent;
    console.log(postImg, postImgPath, click);
    // 이미지 파일이 변경되지 않았을 때는 JSON 파일 변경하지 않음 (기존 이미지 유지)
    if (postImg) {
      // 이미지가 업로드된 경우
      post.attach_file_path = `http://localhost:4000/${postImgPath}`;
    } else if (post.attach_file_path && !req.file && click < 2) {
      // 이미지가 제거된 경우
      // 이미지가 업로드되지 않은 경우
      post.attach_file_path = post.attach_file_path;
    } else {
      // 이미지가 제거된 경우
      post.attach_file_path = "";
    }

    fs.writeFile(filePostsPath, JSON.stringify(posts, null, 2), (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("게시글 수정에 실패했습니다.");
      }
      console.log("게시글 수정 성공");
      return res.status(201).send("게시글 수정 성공");
    });
  });
};

// 게시글 등록
const postPost = (req, res) => {
  const { postTitle, postContent } = req.body;
  console.log(`Title: ${postTitle}, Content: ${postContent}`);
  const postImg = req.file; // 이미지 파일 정보
  const postImgPath = postImg ? postImg.path : ""; // 이미지 파일 경로 설정
  console.log(req.file, req.body, 1000);

  fs.readFile(filePostsPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("게시글 불러오기에 실패했습니다.");
    }
    const posts = JSON.parse(data);
    posts.push({
      post_id: posts.length ? posts[posts.length - 1].post_id + 1 : 1, // 마지막 게시글 id + 1
      post_title: postTitle,
      post_content: postContent,
      attach_file_path: `http://localhost:4000/${postImgPath}`,
      user_id: "583c3ac3f38e84297c002546",
      profileImagePath:
        "https://i.pinimg.com/564x/4d/50/fe/4d50fe8cc1918b8a9b6e6fb8499d1c76.jpg",
      nickname: "엉뚱한개굴",
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      like: 0,
      hits: 0,
      comments: [],
    });
    fs.writeFile(filePostsPath, JSON.stringify(posts, null, 2), (err) => {
      if (err) {
        return res.status(500).send("게시글 추가에 실패했습니다.");
      }
      return res.status(201).send("게시글 추가 성공");
    });
  });
};

// 게시글 삭제
const deletePost = (req, res) => {
  const postId = req.params.postId;
  fs.readFile(filePostsPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("게시글 불러오기에 실패했습니다.");
    }
    const posts = JSON.parse(data);
    const postIndex = posts.findIndex(
      (post) => post.post_id === Number(postId)
    );
    if (postIndex === -1) {
      return res.status(404).send("게시글을 찾을 수 없습니다.");
    }
    posts.splice(postIndex, 1);
    fs.writeFile(filePostsPath, JSON.stringify(posts, null, 2), (err) => {
      if (err) {
        return res.status(500).send("게시글 삭제에 실패했습니다.");
      }
      return res.status(204).send("게시글 삭제 성공");
    });
  });
};

// 댓글 추가 & 수정
const postComment = (req, res) => {
  const postId = req.params.postId;
  const {
    exist,
    comment_id,
    comment_content,
    user_id,
    nickname,
    profileImagePath,
    created_at,
  } = req.body;
  console.log(req.body);
  fs.readFile(filePostsPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("댓글 불러오기에 실패했습니다.");
    }
    const posts = JSON.parse(data);
    const post = posts.find((post) => post.post_id === Number(postId));

    if (exist) {
      // 댓글 수정
      console.log(post.comments, comment_id);
      const matchComment = post.comments.find(
        (comment) => comment.comment_id === Number(comment_id)
      );
      console.log(comment_content);
      matchComment.comment = comment_content;
      matchComment.updated_at = new Date();
      fs.writeFile(filePostsPath, JSON.stringify(posts, null, 2), (err) => {
        if (err) {
          return res.status(500).send("댓글 수정에 실패했습니다.");
        }
        return res.status(204).send("댓글 수정 성공");
      });
    } else {
      // 댓글 추가 요청이 아닌 경우에만 실행
      if (!exist) {
        const newCommentId =
          post.comments.length === 0
            ? 0
            : post.comments[post.comments.length - 1].comment_id;
        post.comments.push({
          comment_id: newCommentId, // 마지막 댓글 id + 1
          user_id: user_id,
          nickname: nickname,
          profileImagePath: profileImagePath,
          comment: comment_content,
          created_at: created_at,
        });
        fs.writeFile(filePostsPath, JSON.stringify(posts, null, 2), (err) => {
          if (err) {
            return res.status(500).send("댓글 추가에 실패했습니다.");
          }
          return res.status(201).send("댓글 추가 성공");
        });
      }
    }
  });
};

// 댓글 삭제
const deleteComment = (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  fs.readFile(filePostsPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("댓글 불러오기에 실패했습니다.");
    }
    const posts = JSON.parse(data);
    const postIndex = posts.findIndex(
      (post) => post.post_id === Number(postId)
    );
    if (postIndex === -1) {
      return res.status(404).send("게시글을 찾을 수 없습니다.");
    }
    const post = posts[postIndex];
    const commentIndex = post.comments.findIndex(
      (comment) => comment.comment_id === Number(commentId)
    );
    if (commentIndex === -1) {
      return res.status(404).send("댓글을 찾을 수 없습니다.");
    }
    post.comments.splice(commentIndex, 1);
    fs.writeFile(filePostsPath, JSON.stringify(posts, null, 2), (err) => {
      if (err) {
        return res.status(500).send("댓글 삭제에 실패했습니다.");
      }
      return res.status(204).send("댓글 삭제 성공");
    });
  });
};

module.exports = {
  getPosts,
  getPost,
  getEditPost,
  postEditPost,
  postPost,
  deletePost,
  postComment,
  deleteComment,
};
