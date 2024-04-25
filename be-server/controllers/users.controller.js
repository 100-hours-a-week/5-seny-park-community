const model = require("../models/users.model");

// json이 아니고 js객체 형태로 저장하나요?
// express fe-server에서 짠거를 be-server로 옮겨야하는데 어떻게 옮기지??
// 경로연결부분이.. 감이 안와유
// 템플릿 엔진 사용하라 했었는가..?

// json 형태로 저장합니다.
// 예시로 아래 users.controller.js 코드를 짜주세요
// Path: be-server/controllers/users.controller.js
// const model = require("../models/users.model");
//
// const getAllUsers = (req, res) => {
//   const users = model.getAllUsers();
//   res.json(users);
// };

// module.exports = {
//   getAllUsers,
// };

// 아니아니. users.model 코드도 짜주세요
// Path: be-server/models/users.model.js
// const users = [
//   {
//     id: 1,
//     name: "Alice",
//   },
