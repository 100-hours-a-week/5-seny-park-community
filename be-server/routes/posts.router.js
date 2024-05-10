const express = require("express");
const postsRouter = express.Router();
const postsController = require("../controllers/posts.controller");
const multer = require("multer");

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/post"); // 이미지 저장 경로
  },
  filename: (req, file, cb) => {
    const originalFileName = file.originalname;
    const sanitizedFileName = originalFileName.replace(/[^\w.-]/g, ""); //  파일명에 포함된 특수문자나 공백을 제거
    cb(null, `${new Date().valueOf()}_${sanitizedFileName}`); // 이미지 파일명
  },
});

const upload = multer({ storage: storage });

// 게시글 목록
postsRouter.get("", postsController.getPosts);

// 게시글 상세 페이지
postsRouter.get("/:postId", postsController.getPost);

// 게시글 등록
postsRouter.post(
  "/createpost",
  upload.single("postPicture"),
  postsController.postPost
);

// 게시글 수정 페이지
postsRouter.get("/edit/:postId", postsController.getEditPost);

// 게시글 수정 페이지 - 수정된 정보 저장
postsRouter.post(
  "/edit/:postId",
  upload.single("postPicture"),
  postsController.postEditPost
);

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
