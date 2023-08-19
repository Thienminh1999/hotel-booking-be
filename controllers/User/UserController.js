const UserService = require("../../services/UserService");
const { errorHandle } = require("../../utils/errorHandler");

exports.postUserSignUp = async (req, res, next) => {
  try {
    const user = await UserService.signUp({
      username: req.body.username,
      password: req.body.password,
      fullName: req.body.fullName,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      isAdmin: req.body.isAdmin || false,
    });
    res.status(200).send(user);
  } catch (error) {
    errorHandle(error, res);
  }
};

exports.postUserLogin = async (req, res, next) => {
  try {
    const result = await UserService.login(
      req.body.username,
      req.body.password
    );
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(401).json({ error: "Password or username is not correct" });
    }
  } catch (error) {
    errorHandle(error, res);
  }
};
