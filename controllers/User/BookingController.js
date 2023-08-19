const HotelService = require("../../services/HotelService");
const RoomService = require("../../services/RoomService");
const TransactionService = require("../../services/TransactionService");
const { errorHandle } = require("../../utils/errorHandler");

exports.postGetAvailableRoom = async (req, res, next) => {
  try {
    const result = await RoomService.getAvailableRoomByTime({
      hotelId: req.body.hotelId,
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
    });
    res.status(200).send(result);
  } catch (error) {
    errorHandle(error, res);
  }
};

exports.postBookingRoom = async (req, res, next) => {
  try {
    const result = await HotelService.postBookingRoom({
      userId: req.body.userId,
      hotelId: req.body.hotelId,
      room: req.body.room,
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      price: req.body.price,
      payment: req.body.payment,
    });
    return res.status(200).send(result);
  } catch (error) {
    errorHandle(error, res);
  }
};

exports.getAllTransactionByUserId = async (req, res, next) => {
  try {
    const result = await TransactionService.getTransactionByUser(
      req.params.userId
    );
    res.status(200).send(result);
  } catch (error) {
    errorHandle(error, res);
  }
};
