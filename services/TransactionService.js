const Transaction = require("../models/transaction");

class TransactionService {
  static async getAllTransaction() {
    return await Transaction.find({})
      .populate("user", "fullName")
      .populate("hotel", "name");
  }

  static async getTransactionByHotel(hotelId) {
    return await Transaction.find({
      hotel: { _id: hotelId },
      status: { $in: ["Checkin", "Booked"] },
    });
  }

  static async getTransactionByUser(userId) {
    return await Transaction.find({
      user: userId,
    }).populate("hotel", "name");
  }

  static async getAmountOfTransaction() {
    const transactions = await Transaction.find();
    return transactions;
  }

  static async getUnavailableRoomNumber({ hotelId, dateStart, dateEnd }) {
    const transactionBooking = await TransactionService.getTransactionByHotel(
      hotelId
    );
    const unAvaiRoomNumber = await getRoomUnAvailableAtTime({
      transactionBooking,
      dateStart,
      dateEnd,
    });
    return unAvaiRoomNumber;
  }

  static async getLatestTransaction(amount) {
    return await Transaction.find()
      .sort({ _id: -1 })
      .limit(amount)
      .populate("hotel", "name")
      .populate("user", "fullName");
  }
}

const getRoomUnAvailableAtTime = async ({
  transactionBooking,
  dateStart,
  dateEnd,
}) => {
  const unavailRoomNumber = transactionBooking.filter((transaction) => {
    const start = new Date(transaction.dateStart);
    const end = new Date(transaction.dateEnd);
    const startDate = new Date(dateStart);
    const endDate = new Date(dateEnd);
    if (
      (start <= endDate && start >= startDate) ||
      (end <= endDate && end >= startDate)
    ) {
      return true;
    }
  });
  const result = getRoomNumberWithouDupplication(unavailRoomNumber);
  return result;
};

const getRoomNumberWithouDupplication = (unavailRoomList) => {
  const room = [];
  unavailRoomList.forEach((item) => {
    const itemRoom = item.room;
    itemRoom.forEach((sub) => room.push(sub));
  });
  const result = [...new Set(room)].join(",");
  return result;
};

module.exports = TransactionService;
