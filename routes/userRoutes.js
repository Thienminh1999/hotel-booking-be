const express = require("express");
const {
  postUserSignUp,
  postUserLogin,
} = require("../controllers/User/UserController");
const {
  getAllTransactionByUserId,
} = require("../controllers/User/BookingController");
const router = express.Router();

router.post("/users/signup", postUserSignUp);
router.post("/users/login", postUserLogin);

router.get("/users/transactions/:userId", getAllTransactionByUserId);

module.exports = router;
