const express = require("express");
const postsRouter = express.Router();
const postsController = require("../controllers/posts.controller");

// 게시글 목록
postsRouter.get("", postsController.getPosts);

// 게시글 상세 페이지
postsRouter.get("/:postId", postsController.getPost);

// 게시글 등록
postsRouter.post("/createpost", postsController.postPost);

// 게시글 수정 페이지
postsRouter.get("/edit/:postId", postsController.getEditPost);

// 게시글 수정 페이지 - 수정된 정보 저장
postsRouter.post("/edit/:postId", postsController.postEditPost);

// 게시글 삭제
postsRouter.delete("/:postId", postsController.deletePost);

// 댓글 추가 & 수정
postsRouter.post("/:postId/comment", postsController.postComment);

// 댓글 삭제
postsRouter.delete(
  "/:postId/comment/:commentId",
  postsController.deleteComment
);

module.exports = postsRouter;
