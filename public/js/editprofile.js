import { setupModalToggle } from "/js/utils.js";

// 회원탈퇴 모달 팝업 이벤트
const bodyEl = document.querySelector("body");
const delEl = document.querySelector(".link .delete");
const modalProfileEl = document.querySelector(".shadow-profile");
const cancelProfileBtn = document.querySelector(".shadow-profile .cancel");
const confirmProfileBtn = document.querySelector(".shadow-profile .delete");

setupModalToggle(delEl, modalProfileEl, bodyEl);
setupModalToggle(cancelProfileBtn, modalProfileEl, bodyEl);
setupModalToggle(confirmProfileBtn, modalProfileEl, bodyEl, "/");
