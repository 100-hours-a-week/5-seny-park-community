const fs = require("fs");
const path = require("path");

const fileUsersPath = path.join(__dirname, "../models/users.model.json");

const postLogin = (req, res) => {
  const { email, password } = req.body;
  console.log(`Email be: ${email}, Password: ${password}`);

  fs.readFile(fileUsersPath, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("사용자 정보를 읽어오는데 실패했습니다.");
    }

    const users = JSON.parse(data);
    console.log(users);

    const user = users.find((user) => user.email === email);

    if (!user) {
      // 회원정보 없음
      return res.status(404).json({
        emailExists: false,
        pwdExists: false,
        message: "Email does not exist.",
      });
    }
    // 회원정보 있으나 비번 틀린 경우
    if (user.password !== password) {
      return res.status(400).json({
        emailExists: true,
        pwdExists: false,
        message: "Password does not match.",
      });
    }
    // 회원정보 있고 비번 일치
    return res.status(200).json({
      emailExists: true,
      pwdExists: true,
      message: "Login successful.",
    });
  });
};

module.exports = {
  postLogin,
};
