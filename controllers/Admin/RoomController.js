const RoomService = require("../../services/RoomService");
const { errorHandle } = require("../../utils/errorHandler");

exports.postAddRoomIntoHotel = async (req, res, next) => {
  try {
    const result = await RoomService.createRoom({
      title: req.body.title,
      price: req.body.price,
      maxPeople: req.body.maxPeople,
      desc: req.body.desc,
      roomNumbers: req.body.roomNumbers,
      hotelId: req.body.hotelId,
    });
    res.status(200).send(result);
  } catch (error) {
    errorHandle(error, res);
  }
};

exports.getAllRooms = async (req, res, next) => {
  try {
    const result = await RoomService.getAllRooms();
    res.status(200).send(result);
  } catch (error) {
    errorHandle(error, res);
  }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    const roomId = req.params.roomId;
    const result = await RoomService.deleteRoom(roomId);
    if (Array.isArray(result)) {
      res
        .status(409)
        .send({ message: `Room: ${result.join(", ")} is in booking` });
    } else {
      res.status(200).send({ message: "OK" });
    }
  } catch (error) {
    errorHandle(error, res);
  }
};

exports.getRoomDetails = async (req, res, next) => {
  try {
    const result = await RoomService.getRoomDetails(req.params.roomId);
    res.status(200).send(result);
  } catch (error) {
    errorHandle(error, res);
  }
};

exports.updateRoom = async (req, res, next) => {
  try {
    const result = await RoomService.updateRoomById(req.body);
    res.status(200).send(result);
  } catch (error) {
    errorHandle(error, res);
  }
};
