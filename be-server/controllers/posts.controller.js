const db = require("../mysql.js"); // mysql.js 파일 import
const { post } = require("../routes/posts.router.js");

// 게시글 목록
const getPosts = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" }); // 로그인이 필요함
  }
  try {
    // 게시글 목록, 작성자 정보 함께 조회
    const [posts] = await db.execute(`
      SELECT p.*, u.nickname, u.profile_image
      FROM post p
      JOIN user u ON p.user_id = u.user_id
      WHERE p.is_deleted = 0
    `);
    return res.json(posts);
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
    return res.json({ post, comments });
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

// 게시글 등록
const postPost = async (req, res) => {
  const { postTitle, postContent } = req.body;
  const { id } = req.session.user;
  const postImg = req.file; // 이미지 파일 정보
  const postImgPath = postImg
    ? `http://localhost:4000/images/post/${postImg.filename}`
    : null;

  try {
    // 새로운 게시글 DB에 추가
    await db.execute(
      `
      INSERT INTO post (user_id, post_title, post_content, post_image, created_at, updated_at, deleted_at, likes, hits, comments, is_deleted)
      VALUES (?, ?, ?, ?, NOW(), NOW(), NULL, 0, 0, 0, 0)
    `,
      [id, postTitle, postContent, postImgPath]
    );

    return res.status(201).send("게시글 추가 성공");
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "게시글 추가에 실패했습니다.", error: err.message });
  }
};

// 게시글 수정 권한 확인
const checkEditPermission = async (req, res) => {
  const postId = req.params.postId;
  const { id } = req.session.user;

  try {
    const [posts] = await db.execute("SELECT * FROM post WHERE post_id = ?", [
      postId,
    ]);

    if (posts.length === 0) {
      return res.status(404).send("게시글을 찾을 수 없습니다.");
    }

    const post = posts[0];

    if (post.user_id !== id) {
      return res.status(403).send("게시글 수정 권한이 없습니다.");
    }

    res.status(200).send("권한 확인 성공");
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "게시글 불러오기에 실패했습니다.", error: err.message });
  }
};

// 게시글 수정 페이지
const getEditPost = async (req, res) => {
  const postId = req.params.postId;
  // console.log(`PostId: ${postId}`);
  try {
    const [posts] = await db.execute("SELECT * FROM post WHERE post_id = ?", [
      postId,
    ]);

    if (posts.length === 0) {
      return res.status(404).send("게시글을 찾을 수 없습니다.");
    }

    const post = posts[0];
    res.json(post);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "게시글 불러오기에 실패했습니다.", error: err.message });
  }
};

// 게시글 수정 페이지 - 수정된 정보 저장
const postEditPost = async (req, res) => {
  const postId = req.params.postId;
  const { postTitle, postContent, click } = req.body;
  const postImg = req.file; // 이미지 파일 정보
  const postImgPath = postImg
    ? `http://localhost:4000/images/post/${postImg.filename}`
    : null;

  try {
    const [posts] = await db.execute("SELECT * FROM post WHERE post_id = ?", [
      postId,
    ]);

    if (posts.length === 0) {
      return res.status(404).send("게시글을 찾을 수 없습니다.");
    }
    const post = posts[0];
    const newPostImgPath = postImgPath
      ? postImgPath
      : post.post_image && !req.file && click < 2
      ? post.post_image
      : "";

    await db.execute(
      `
      UPDATE post
      SET post_title = ?, post_content = ?, post_image = ?, updated_at = NOW()
      WHERE post_id = ?
    `,
      [postTitle, postContent, newPostImgPath, postId]
    );

    res.status(201).send("게시글 수정 성공");
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "게시글 수정에 실패했습니다.", error: err.message });
  }
};

// 게시글 삭제
const deletePost = async (req, res) => {
  const postId = req.params.postId;
  const { id } = req.session.user;

  // 트랜잭션 시작
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const [posts] = await connection.execute(
      "SELECT * FROM post WHERE post_id = ?",
      [postId]
    );

    if (posts.length === 0) {
      await connection.rollback();
      return res.status(404).send("게시글을 찾을 수 없습니다.");
    }

    const post = posts[0];

    if (post.user_id !== id) {
      await connection.rollback();
      return res.status(403).send("게시글 삭제 권한이 없습니다.");
    }

    await connection.execute(
      "UPDATE post SET is_deleted = 1, deleted_at = NOW() WHERE post_id = ?",
      [postId]
    );
    await connection.execute(
      "UPDATE comment SET is_deleted = 1, deleted_at = NOW() WHERE post_id = ?",
      [postId]
    );

    await connection.commit();
    return res.status(204).send("게시글 삭제 성공");
  } catch (err) {
    await connection.rollback();
    console.error(err);
    return res
      .status(500)
      .json({ message: "게시글 삭제에 실패했습니다.", error: err.message });
  } finally {
    connection.release();
  }
};

// 댓글 추가 & 수정
const postComment = async (req, res) => {
  const postId = req.params.postId;
  const { exist, comment_id, comment_content } = req.body;
  const { id } = req.session.user;

  // 트랜잭션 시작
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    if (exist) {
      const [comments] = await connection.execute(
        "SELECT * FROM comment WHERE comment_id = ?",
        [comment_id]
      );

      if (comments.length === 0) {
        await connection.rollback();
        return res.status(404).send("댓글을 찾을 수 없습니다.");
      }

      const comment = comments[0];

      if (comment.user_id !== id) {
        await connection.rollback();
        return res.status(403).send("댓글 수정 권한이 없습니다.");
      }

      await connection.execute(
        `
        UPDATE comment
        SET comment = ?, updated_at = NOW()
        WHERE comment_id = ?
      `,
        [comment_content, comment_id]
      );

      await connection.commit();
      return res.status(204).send("댓글 수정 성공");
    } else {
      await connection.execute(
        `
        INSERT INTO comment (post_id, user_id, comment, created_at, updated_at, deleted_at, is_deleted)
        VALUES (?, ?, ?, NOW(), NOW(), NULL, 0)
      `,
        [postId, id, comment_content]
      );

      await connection.execute(
        `UPDATE post SET comments = comments + 1 WHERE post_id = ?`,
        [postId]
      );

      await connection.commit();
      return res.status(201).send("댓글 추가 성공");
    }
  } catch (err) {
    await connection.rollback();
    console.error(err);
    return res
      .status(500)
      .json({ message: "댓글 추가에 실패했습니다.", error: err.message });
  } finally {
    connection.release();
  }
};

// 댓글 삭제
const deleteComment = async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  const { id } = req.session.user;

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const [comments] = await connection.execute(
      `SELECT * FROM comment WHERE comment_id = ?`,
      [commentId]
    );

    if (comments.length === 0) {
      await connection.rollback();
      return res.status(404).send("댓글을 찾을 수 없습니다.");
    }

    const comment = comments[0];

    if (comment.user_id !== id) {
      await connection.rollback();
      return res.status(403).send("댓글 삭제 권한이 없습니다.");
    }

    await connection.execute(
      `UPDATE comment SET is_deleted = 1, deleted_at = NOW() WHERE comment_id = ?`,
      [commentId]
    );
    await connection.execute(
      `UPDATE post SET comments = comments - 1 WHERE post_id = ?`,
      [postId]
    );

    await connection.commit();
    return res.status(204).send("댓글 삭제 성공");
  } catch (err) {
    await connection.rollback();
    console.error(err);
    return res
      .status(500)
      .json({ message: "댓글 삭제에 실패했습니다.", error: err.message });
  } finally {
    connection.release();
  }
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
