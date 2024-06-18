// const fs = require("fs");
// const path = require("path");

// const filePostsPath = path.join(__dirname, "../models/posts.model.json");
const db = require("../mysql.js"); // mysql.js 파일 import

// 게시글 목록
const getPosts = async (req, res) => {
  if (!req.session.user) {
    res.status(401).json({ message: "Unauthorized" }); // 로그인이 필요함
  }
  try {
    // 게시글 목록, 작성자 정보 함께 조회
    const [posts] = await db.execute(`
      SELECT p.*, u.nickname, u.profile_image
      FROM post p
      JOIN user u ON p.user_id = u.user_id
      WHERE p.is_deleted = 0
    `);
    res.json(posts);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "게시글 불러오기에 실패했습니다.", error: err.message });
  }
};

// 게시글 상세 페이지
const getPost = async (req, res) => {
  const postId = req.params.postId;

  // 트랜잭션 시작
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // 조회수 증가
    await db.execute("UPDATE post SET hits = hits + 1 WHERE post_id = ?", [
      postId,
    ]);

    // 해당 게시글의 댓글들을 조회
    const [comments] = await db.execute(
      `
      SELECT c.*, u.nickname, u.profile_image
      FROM comment c
      JOIN user u ON c.user_id = u.user_id
      WHERE c.post_id = ? AND c.is_deleted = 0
    `,
      [postId]
    );

    // postId 게시글 조회
    const [posts] = await db.execute(
      `
      SELECT p.*, u.nickname, u.profile_image
      FROM post p
      JOIN user u ON p.user_id = u.user_id
      WHERE p.post_id = ? AND p.is_deleted = 0
    `,
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).send("게시글을 찾을 수 없습니다.");
    }

    const post = posts[0];

    // 트랜잭션 커밋
    await connection.commit();

    // post.comments = comments;
    res.json({ post, comments });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    return res
      .status(500)
      .json({ message: "게시글 불러오기에 실패했습니다.", error: err.message });
  } finally {
    connection.release();
  }
};
// fs.readFile(filePostsPath, "utf-8", (err, data) => {
//   if (err) {
//     return res.status(500).send("게시글 불러오기에 실패했습니다.");
//   }
//   const posts = JSON.parse(data); // JSON 형식의 문자열을 객체로 변환
//   const post = posts.find((post) => post.post_id === Number(postId));

//   // 만약 post 객체가 존재하면 hits 속성을 증가시킵니다.
//   if (post) {
//     post.hits = Number(post.hits) + 1; // 조회수 증가
//   }

//   console.log(post);
//   // 업데이트된 게시글 정보를 파일에 저장
//   fs.writeFile(filePostsPath, JSON.stringify(posts, null, 2), (err) => {
//     if (err) {
//       return res.status(500).send("조회수 업데이트에 실패했습니다.");
//     }
//     res.json(post);
//   });
// });

// 게시글 수정 권한 확인
const checkEditPermission = (req, res, next) => {
  const postId = req.params.postId;
  const { id } = req.session.user;
  fs.readFile(filePostsPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("게시글 불러오기에 실패했습니다.");
    }
    const posts = JSON.parse(data);
    const post = posts.find((post) => post.post_id === Number(postId));
    if (post.user_id !== id) {
      console.log("권한 없음");
      return res.status(403).send("게시글 수정 권한이 없습니다.");
    }
    res.status(200).send("권한 확인 성공");
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
    const postIndex = posts.findIndex(
      (post) => post.post_id === Number(postId)
    );
    if (postIndex !== -1) {
      posts[postIndex] = {
        ...posts[postIndex],
        post_title: postTitle,
        post_content: postContent,
        attach_file_path: postImg // 이미지 파일이 변경되지 않았을 때는 JSON 파일 변경하지 않음 (기존 이미지 유지)
          ? `http://localhost:4000/${postImgPath}`
          : posts[postIndex].attach_file_path && !req.file && click < 2 // 삼항 연산자 중첩을 통해 if...else if...else 구문 표현
          ? posts[postIndex].attach_file_path // 이미지가 업로드되지 않은 경우 기존 이미지 유지
          : "", // 이미지가 제거된 경우
        updated_at: new Date(),
      };
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
  const { id, nickname, profileImg } = req.session.user;
  const postImg = req.file; // 이미지 파일 정보
  const postImgPath = postImg ? postImg.path : ""; // 이미지 파일 경로 설정

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
      user_id: id,
      profileImagePath: profileImg.replace("/images", ""),
      nickname: nickname,
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
  const { id } = req.session.user;
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
    if (posts[postIndex].user_id !== id) {
      return res.status(403).send("게시글 삭제 권한이 없습니다.");
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
  const { exist, comment_id, comment_content, created_at } = req.body;
  const { id, nickname, profileImg } = req.session.user;

  fs.readFile(filePostsPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("댓글 불러오기에 실패했습니다.");
    }
    const posts = JSON.parse(data);
    const post = posts.find((post) => post.post_id === Number(postId));

    if (exist) {
      // 댓글 수정
      const commentIndex = post.comments.findIndex(
        (comment) => comment.comment_id === Number(comment_id)
      );

      if (commentIndex === -1) {
        return res.status(404).send("댓글을 찾을 수 없습니다.");
      }

      if (post.comments[commentIndex].user_id !== id) {
        return res.status(403).send("댓글 수정 권한이 없습니다.");
      }

      post.comments[commentIndex] = {
        ...post.comments[commentIndex],
        comment: comment_content,
        updated_at: new Date(),
      };

      fs.writeFile(filePostsPath, JSON.stringify(posts, null, 2), (err) => {
        if (err) {
          return res.status(500).send("댓글 수정에 실패했습니다.");
        }
        return res.status(204).send("댓글 수정 성공");
      });
    } else {
      // 댓글 수정 요청이 아닌 경우에만 실행
      // 옵셔녈 체이닝 사용 // || : 둘중하나만 참이면 되기 때문에, 참인 경우 처음 등장하는 참값 리턴. 모두 거짓이라면 마지막 거짓값을 리턴.  (거짓의 기준 : false인 모든 값)
      const lastCommentId =
        post.comments[post.comments.length - 1]?.comment_id || 0;
      post.comments.push({
        comment_id: lastCommentId + 1, // 마지막 댓글 id + 1
        user_id: id,
        nickname: nickname,
        profileImagePath: profileImg.replace("/images", ""),
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
  });
};

// 댓글 삭제
const deleteComment = (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  const { id } = req.session.user;
  console.log(id, req.session.user);
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
    if (post.comments[commentIndex].user_id !== id) {
      return res.status(403).send("댓글 삭제 권한이 없습니다.");
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
  checkEditPermission,
  getEditPost,
  postEditPost,
  postPost,
  deletePost,
  postComment,
  deleteComment,
};

// const fs = require("fs");
// const path = require("path");

// const filePostsPath = path.join(__dirname, "../models/posts.model.json");

// // 게시글 목록
// const getPosts = (req, res) => {
//   if (!req.session.user) {
//     res.status(401).json({ message: "Unauthorized" }); // 로그인이 필요함
//   } else {
//     fs.readFile(filePostsPath, "utf-8", (err, data) => {
//       if (err) {
//         return res.status(500).send("게시글 불러오기에 실패했습니다.");
//       }
//       const posts = JSON.parse(data);
//       res.json(posts);
//     });
//   }
// };

// // 게시글 상세 페이지
// const getPost = (req, res) => {
//   const postId = req.params.postId;
//   fs.readFile(filePostsPath, "utf-8", (err, data) => {
//     if (err) {
//       return res.status(500).send("게시글 불러오기에 실패했습니다.");
//     }
//     const posts = JSON.parse(data); // JSON 형식의 문자열을 객체로 변환
//     const post = posts.find((post) => post.post_id === Number(postId));

//     // 만약 post 객체가 존재하면 hits 속성을 증가시킵니다.
//     if (post) {
//       post.hits = Number(post.hits) + 1; // 조회수 증가
//     }

//     console.log(post);
//     // 업데이트된 게시글 정보를 파일에 저장
//     fs.writeFile(filePostsPath, JSON.stringify(posts, null, 2), (err) => {
//       if (err) {
//         return res.status(500).send("조회수 업데이트에 실패했습니다.");
//       }
//       res.json(post);
//     });
//   });
// };

// // 게시글 수정 권한 확인
// const checkEditPermission = (req, res, next) => {
//   const postId = req.params.postId;
//   const { id } = req.session.user;
//   fs.readFile(filePostsPath, "utf-8", (err, data) => {
//     if (err) {
//       return res.status(500).send("게시글 불러오기에 실패했습니다.");
//     }
//     const posts = JSON.parse(data);
//     const post = posts.find((post) => post.post_id === Number(postId));
//     if (post.user_id !== id) {
//       console.log("권한 없음");
//       return res.status(403).send("게시글 수정 권한이 없습니다.");
//     }
//     res.status(200).send("권한 확인 성공");
//   });
// };

// // 게시글 수정 페이지
// const getEditPost = (req, res) => {
//   const postId = req.params.postId;
//   console.log(`PostId: ${postId}`);
//   fs.readFile(filePostsPath, "utf-8", (err, data) => {
//     if (err) {
//       return res.status(500).send("게시글 불러오기에 실패했습니다.");
//     }
//     const posts = JSON.parse(data);
//     const post = posts.find((post) => post.post_id === Number(postId));
//     res.json(post);
//   });
// };

// // 게시글 수정 페이지 - 수정된 정보 저장
// const postEditPost = (req, res) => {
//   const postId = req.params.postId;
//   console.log(req.body);
//   const { postTitle, postContent, click } = req.body;
//   console.log(`Title: ${postTitle}, Content: ${postContent}`);
//   const postImg = req.file; // 이미지 파일 정보
//   const postImgPath = postImg ? postImg.path : ""; // 이미지 파일 경로 설정
//   fs.readFile(filePostsPath, "utf-8", (err, data) => {
//     if (err) {
//       return res.status(500).send("게시글 불러오기에 실패했습니다.");
//     }
//     const posts = JSON.parse(data);
//     const postIndex = posts.findIndex(
//       (post) => post.post_id === Number(postId)
//     );
//     if (postIndex !== -1) {
//       posts[postIndex] = {
//         ...posts[postIndex],
//         post_title: postTitle,
//         post_content: postContent,
//         attach_file_path: postImg // 이미지 파일이 변경되지 않았을 때는 JSON 파일 변경하지 않음 (기존 이미지 유지)
//           ? `http://localhost:4000/${postImgPath}`
//           : posts[postIndex].attach_file_path && !req.file && click < 2 // 삼항 연산자 중첩을 통해 if...else if...else 구문 표현
//           ? posts[postIndex].attach_file_path // 이미지가 업로드되지 않은 경우 기존 이미지 유지
//           : "", // 이미지가 제거된 경우
//         updated_at: new Date(),
//       };
//     }

//     fs.writeFile(filePostsPath, JSON.stringify(posts, null, 2), (err) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send("게시글 수정에 실패했습니다.");
//       }
//       console.log("게시글 수정 성공");
//       return res.status(201).send("게시글 수정 성공");
//     });
//   });
// };

// // 게시글 등록
// const postPost = (req, res) => {
//   const { postTitle, postContent } = req.body;
//   const { id, nickname, profileImg } = req.session.user;
//   const postImg = req.file; // 이미지 파일 정보
//   const postImgPath = postImg ? postImg.path : ""; // 이미지 파일 경로 설정

//   fs.readFile(filePostsPath, "utf-8", (err, data) => {
//     if (err) {
//       return res.status(500).send("게시글 불러오기에 실패했습니다.");
//     }
//     const posts = JSON.parse(data);
//     posts.push({
//       post_id: posts.length ? posts[posts.length - 1].post_id + 1 : 1, // 마지막 게시글 id + 1
//       post_title: postTitle,
//       post_content: postContent,
//       attach_file_path: `http://localhost:4000/${postImgPath}`,
//       user_id: id,
//       profileImagePath: profileImg.replace("/images", ""),
//       nickname: nickname,
//       created_at: new Date(),
//       updated_at: new Date(),
//       deleted_at: null,
//       like: 0,
//       hits: 0,
//       comments: [],
//     });
//     fs.writeFile(filePostsPath, JSON.stringify(posts, null, 2), (err) => {
//       if (err) {
//         return res.status(500).send("게시글 추가에 실패했습니다.");
//       }
//       return res.status(201).send("게시글 추가 성공");
//     });
//   });
// };

// // 게시글 삭제
// const deletePost = (req, res) => {
//   const postId = req.params.postId;
//   const { id } = req.session.user;
//   fs.readFile(filePostsPath, "utf-8", (err, data) => {
//     if (err) {
//       return res.status(500).send("게시글 불러오기에 실패했습니다.");
//     }
//     const posts = JSON.parse(data);
//     const postIndex = posts.findIndex(
//       (post) => post.post_id === Number(postId)
//     );
//     if (postIndex === -1) {
//       return res.status(404).send("게시글을 찾을 수 없습니다.");
//     }
//     if (posts[postIndex].user_id !== id) {
//       return res.status(403).send("게시글 삭제 권한이 없습니다.");
//     }

//     posts.splice(postIndex, 1);
//     fs.writeFile(filePostsPath, JSON.stringify(posts, null, 2), (err) => {
//       if (err) {
//         return res.status(500).send("게시글 삭제에 실패했습니다.");
//       }
//       return res.status(204).send("게시글 삭제 성공");
//     });
//   });
// };

// // 댓글 추가 & 수정
// const postComment = (req, res) => {
//   const postId = req.params.postId;
//   const { exist, comment_id, comment_content, created_at } = req.body;
//   const { id, nickname, profileImg } = req.session.user;

//   fs.readFile(filePostsPath, "utf-8", (err, data) => {
//     if (err) {
//       return res.status(500).send("댓글 불러오기에 실패했습니다.");
//     }
//     const posts = JSON.parse(data);
//     const post = posts.find((post) => post.post_id === Number(postId));

//     if (exist) {
//       // 댓글 수정
//       const commentIndex = post.comments.findIndex(
//         (comment) => comment.comment_id === Number(comment_id)
//       );

//       if (commentIndex === -1) {
//         return res.status(404).send("댓글을 찾을 수 없습니다.");
//       }

//       if (post.comments[commentIndex].user_id !== id) {
//         return res.status(403).send("댓글 수정 권한이 없습니다.");
//       }

//       post.comments[commentIndex] = {
//         ...post.comments[commentIndex],
//         comment: comment_content,
//         updated_at: new Date(),
//       };

//       fs.writeFile(filePostsPath, JSON.stringify(posts, null, 2), (err) => {
//         if (err) {
//           return res.status(500).send("댓글 수정에 실패했습니다.");
//         }
//         return res.status(204).send("댓글 수정 성공");
//       });
//     } else {
//       // 댓글 수정 요청이 아닌 경우에만 실행
//       // 옵셔녈 체이닝 사용 // || : 둘중하나만 참이면 되기 때문에, 참인 경우 처음 등장하는 참값 리턴. 모두 거짓이라면 마지막 거짓값을 리턴.  (거짓의 기준 : false인 모든 값)
//       const lastCommentId =
//         post.comments[post.comments.length - 1]?.comment_id || 0;
//       post.comments.push({
//         comment_id: lastCommentId + 1, // 마지막 댓글 id + 1
//         user_id: id,
//         nickname: nickname,
//         profileImagePath: profileImg.replace("/images", ""),
//         comment: comment_content,
//         created_at: created_at,
//       });
//       fs.writeFile(filePostsPath, JSON.stringify(posts, null, 2), (err) => {
//         if (err) {
//           return res.status(500).send("댓글 추가에 실패했습니다.");
//         }
//         return res.status(201).send("댓글 추가 성공");
//       });
//     }
//   });
// };

// // 댓글 삭제
// const deleteComment = (req, res) => {
//   const postId = req.params.postId;
//   const commentId = req.params.commentId;
//   const { id } = req.session.user;
//   console.log(id, req.session.user);
//   fs.readFile(filePostsPath, "utf-8", (err, data) => {
//     if (err) {
//       return res.status(500).send("댓글 불러오기에 실패했습니다.");
//     }
//     const posts = JSON.parse(data);
//     const postIndex = posts.findIndex(
//       (post) => post.post_id === Number(postId)
//     );
//     if (postIndex === -1) {
//       return res.status(404).send("게시글을 찾을 수 없습니다.");
//     }
//     const post = posts[postIndex];
//     const commentIndex = post.comments.findIndex(
//       (comment) => comment.comment_id === Number(commentId)
//     );
//     if (commentIndex === -1) {
//       return res.status(404).send("댓글을 찾을 수 없습니다.");
//     }
//     if (post.comments[commentIndex].user_id !== id) {
//       return res.status(403).send("댓글 삭제 권한이 없습니다.");
//     }
//     post.comments.splice(commentIndex, 1);
//     fs.writeFile(filePostsPath, JSON.stringify(posts, null, 2), (err) => {
//       if (err) {
//         return res.status(500).send("댓글 삭제에 실패했습니다.");
//       }
//       return res.status(204).send("댓글 삭제 성공");
//     });
//   });
// };

// module.exports = {
//   getPosts,
//   getPost,
//   checkEditPermission,
//   getEditPost,
//   postEditPost,
//   postPost,
//   deletePost,
//   postComment,
//   deleteComment,
// };
