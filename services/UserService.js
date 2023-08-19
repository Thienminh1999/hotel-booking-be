const User = require("../models/user");

class UserService {
  static async signUp(userInfo) {
    const newUser = new User({
      username: userInfo.username,
      password: userInfo.password,
      fullName: userInfo.fullName,
      phoneNumber: userInfo.phoneNumber,
      email: userInfo.email,
      isAdmin: userInfo.isAdmin,
    });
    const result = await newUser.save();
    return result;
  }

  static async getAmountUser() {
    const users = await User.find();
    return users.length;
  }

  static async login(username, password) {
    const user = await User.findOne({
      username: username,
      password: password,
    })
      .lean()
      .exec();
    return user;
  }
}

module.exports = UserService;
