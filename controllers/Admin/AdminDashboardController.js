const TransactionService = require("../../services/TransactionService");
const UserService = require("../../services/UserService");
const { errorHandle } = require("../../utils/errorHandler");

exports.getCommonInfo = async (req, res, next) => {
  try {
    const amountOfUser = await UserService.getAmountUser();
    const transactions = await TransactionService.getAmountOfTransaction();

    let sumOfEarning = 0;
    transactions.forEach((item) => {
      sumOfEarning += item.price;
    });
    res.status(200).send({
      amountUser: amountOfUser,
      amountTransaction: transactions.length,
      earning: sumOfEarning,
    });
  } catch (error) {
    errorHandle(error, res);
  }
};

exports.getAllTransaction = async (req, res, next) => {
  try {
    const result = await TransactionService.getAllTransaction();
    res.status(200).send(result);
  } catch (error) {
    errorHandle(error, res);
  }
};

exports.getLatestTransaction = async (req, res, next) => {
  try {
    const result = await TransactionService.getLatestTransaction(
      req.params.amount
    );
    res.status(200).send(result);
  } catch (error) {}
};
