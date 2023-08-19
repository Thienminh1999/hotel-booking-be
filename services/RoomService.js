const Room = require("../models/room");
const HotelService = require("./HotelService");
const TransactionService = require("./TransactionService");

class RoomService {
  static async getAvailableRoomByTime({ hotelId, dateStart, dateEnd }) {
    const unavailableRoomNumber =
      await TransactionService.getUnavailableRoomNumber({
        hotelId,
        dateStart,
        dateEnd,
      });
    const allRoomOfHotel = await HotelService.getRoomsOfHotel(hotelId);
    const result = getAllRoomAvailable(allRoomOfHotel, unavailableRoomNumber);

    return result;
  }

  static async createRoom(roomInfo) {
    const newRoom = new Room({
      title: roomInfo.title,
      price: roomInfo.price,
      maxPeople: roomInfo.maxPeople,
      desc: roomInfo.desc,
      roomNumbers: roomInfo.roomNumbers,
    });

    const room = await newRoom.save();
    const hotel = await HotelService.addRoomIntoHotel(roomInfo.hotelId, room);

    return hotel;
  }

  static async getAllRooms() {
    const rooms = await Room.find();
    return rooms;
  }

  static async deleteRoom(roomId) {
    const hotelOwner = await HotelService.findHotelByRoomId(roomId);
    const transactionOfRoom = await TransactionService.getTransactionByHotel(
      hotelOwner._id
    );
    const roomObj = await Room.findById(roomId);
    const roonNumberInBooking = findRoomNumberInBooking(
      transactionOfRoom,
      roomObj.roomNumbers
    );
    if (roonNumberInBooking.length > 0) {
      return roonNumberInBooking;
    } else {
      await Room.findByIdAndRemove(roomId);
    }
  }

  static async updateRoomById(data) {
    const result = await Room.findByIdAndUpdate(data._id, data);
    return result;
  }

  static async getRoomDetails(roomId) {
    const room = await Room.findById(roomId).lean();
    console.log(room._id.toString());
    const hotelOwner = await HotelService.findHotelByRoomId(
      room._id.toString()
    );
    console.log(hotelOwner);
    return { ...room, hotel: hotelOwner };
  }
}

const findRoomNumberInBooking = (transactions, roomNumber) => {
  const inBookingArr = [];
  transactions.map((item) => {
    const rooms = getItemDuplication(item.room, roomNumber);
    addToArrWithoutDuplication(rooms, inBookingArr);
  });
  return inBookingArr;
};

const addToArrWithoutDuplication = (rooms, arr) => {
  rooms.map((item) => {
    if (!arr.includes(item)) {
      arr.push(item);
    }
  });
};

const getItemDuplication = (arr1, arr2) => {
  const dupArr = [];
  arr1.map((item) => {
    if (arr2.includes(item)) {
      dupArr.push(item);
    }
  });
  return dupArr;
};

// const getRoomUnAvailableAtTime = async ({
//   transactionBooking,
//   dateStart,
//   dateEnd,
// }) => {
//   const unavailRoomNumber = transactionBooking.filter((transaction) => {
//     if (
//       !(
//         dateStart >= transaction.dateStart &&
//         transaction.dateStart &&
//         dateEnd <= transaction.dateStart &&
//         transaction.dateStart
//       )
//     ) {
//       return true;
//     }
//   });
//   const result = [unavailRoomNumber.map((item) => item.room).join()];
//   return result;
// };

const getAllRoomAvailable = (allRoomOfHotel, unAvaiRoomNumber) => {
  const result = [];
  allRoomOfHotel.forEach((item) => {
    const filteredRoomNumbers = [];
    item.roomNumbers.forEach((roomNumber) => {
      if (!unAvaiRoomNumber.includes(roomNumber)) {
        filteredRoomNumbers.push(roomNumber);
      }
    });
    result.push({ ...item, roomNumbers: filteredRoomNumbers });
  });

  return result;
};

module.exports = RoomService;
