const Hotel = require("../models/hotel");
const Transaction = require("../models/transaction");
const MessageResponse = require("../utils/MessageResponse");
const TransactionService = require("./TransactionService");

class HotelService {
  // Hàm này xử lý logic tìm kiếm khách sạn bằng thành phố.
  static async findAllHotel() {
    const hotels = await Hotel.find();
    return hotels;
  }

  static async findByCity(city) {
    if (city) {
      const hotels = await Hotel.find({
        city: { $in: city },
      });
      return hotels;
    } else {
      return await Hotel.find({});
    }
  }

  static async getAmountByType(type) {
    const hotels = await Hotel.find({
      type: type,
    });
    return hotels.length;
  }

  static async getTop3Rating() {
    const hotels = await Hotel.find({}).sort({ rating: -1 }).limit(3);
    return hotels;
  }

  static async postFindHotelByFilter(filter) {
    let result;
    result = await this.findByCity(filter.city);

    if (filter.startDate && filter.endDate) {
      result = await getHotelAvailableAtTime({
        hotels: result,
        dateStart: filter.startDate,
        dateEnd: filter.endDate,
      });
    }
    if (filter.numberPeople) {
      result = await getHotelEnoughRoomSlot({
        hotels: result,
        people: filter.numberPeople,
      });
    }
    if (filter.room && filter.room > 0) {
      result = await getHotelEnoughSlotPerRoom({
        hotels: result,
        roomAmount: filter.room,
        people: filter.numberPeople,
      });
    }

    return result;
  }

  static async getHotelById(hotelId) {
    const result = await Hotel.findById(hotelId);
    return result;
  }

  static async postBookingRoom(bookingInfo) {
    const unavailableRoomNumber =
      await TransactionService.getUnavailableRoomNumber({
        hotelId: bookingInfo.hotelId,
        dateStart: bookingInfo.dateStart,
        dateEnd: bookingInfo.dateEnd,
      });
    if (isRoomNumberCanBook(bookingInfo.room, unavailableRoomNumber)) {
      const transaction = new Transaction({
        user: bookingInfo.userId,
        hotel: bookingInfo.hotelId,
        room: bookingInfo.room,
        dateStart: bookingInfo.dateStart,
        dateEnd: bookingInfo.dateEnd,
        price: bookingInfo.price,
        payment: bookingInfo.payment,
        status: "Booked",
      });
      const result = await transaction.save();
      return result;
    }
    return new MessageResponse(
      "fail",
      "Some rooms in booking, please choose another room"
    );
  }

  static async getRoomsOfHotel(hotelId) {
    const result = await Hotel.findById(hotelId, "rooms")
      .populate("rooms")
      .lean();

    return result?.rooms || [];
  }

  static async deleteHotelById(hotelId) {
    return await Hotel.findOneAndDelete({ _id: hotelId });
  }

  static async createHotel(hotelInfo) {
    const hotel = new Hotel(hotelInfo);
    const result = await hotel.save();
    return result;
  }

  static async addRoomIntoHotel(hotelId, room) {
    const hotel = await Hotel.findById(hotelId);
    if (room.price < hotel.cheapestPrice || hotel.cheapestPrice === 0) {
      hotel.cheapestPrice = room.price;
    }
    hotel.rooms.push(room._id);
    const result = await hotel.save();
    return result;
  }

  static async findHotelByRoomId(roomId) {
    const hotels = await Hotel.find({});
    let result;
    await Promise.all(
      hotels.map((item) => {
        item.rooms?.forEach((room) => {
          if (room?._id.toString() == roomId) {
            result = item;
          }
        });
      })
    );

    return result;
  }

  static async getAmountOfHotel() {
    const hotelInHanoi = await this.findByCity("Ha Noi");
    const hotelInHCM = await this.findByCity("Ho Chi Minh");
    const hotelInDanang = await this.findByCity("Dang Nang");

    const result = [
      {
        city: "Ha Noi",
        amount: hotelInHanoi.length,
      },
      {
        city: "Ho Chi Minh",
        amount: hotelInHCM.length,
      },
      {
        city: "Dang Nang",
        amount: hotelInDanang.length,
      },
    ];

    return result;
  }

  static async getAmountHotelByType() {
    const hotelType = await this.getAmountByType("hotel");
    const apartmentType = await this.getAmountByType("apartments");
    const resortType = await this.getAmountByType("resorts");
    const villaType = await this.getAmountByType("villas");
    const cabinType = await this.getAmountByType("cabins");
    const result = [
      { type: "hotel", amount: hotelType },
      { type: "apartments", amount: apartmentType },
      { type: "resorts", amount: resortType },
      { type: "villas", amount: villaType },
      { type: "cabins", amount: cabinType },
    ];

    return result;
  }

  static async updateHotelById(data) {
    const result = await Hotel.findByIdAndUpdate(data._id, data);
    return result;
  }
}

const getHotelEnoughSlotPerRoom = async ({ hotels, roomAmount, people }) => {
  const result = [];
  const slotPerRoom = Number(people / roomAmount).toFixed();
  await Promise.all(
    hotels.map(async (hotel) => {
      if (await isHotelHavingSlotPerRoom(hotel._id, slotPerRoom)) {
        result.push(hotel);
      }
    })
  );
  return result;
};

const isHotelHavingSlotPerRoom = async (hotelId, slotPerRoom) => {
  const roomsOfHotel = await HotelService.getRoomsOfHotel(hotelId);
  let isHaving = false;
  await Promise.all(
    roomsOfHotel.map((item) => {
      if (item.maxPeople >= slotPerRoom) {
        isHaving = true;
      }
    })
  );
  return isHaving;
};

const getHotelEnoughRoomSlot = async ({ hotels, people }) => {
  const result = [];
  await Promise.all(
    hotels.map(async (hotel) => {
      const sumofSlot = await getSumOfSlotHotelHaving(hotel._id);
      if (sumofSlot >= people) {
        result.push(hotel);
      }
    })
  );

  return result;
};

const getSumOfSlotHotelHaving = async (hotelId) => {
  const roomsOfHotel = await Hotel.findById(hotelId, "rooms")
    .populate("rooms")
    .exec();
  let sumOfSlotAvailable = 0;
  if (roomsOfHotel && roomsOfHotel.rooms.length > 0) {
    roomsOfHotel.rooms.forEach((room) => {
      sumOfSlotAvailable += room.maxPeople * room.roomNumbers.length;
    });
  }
  return sumOfSlotAvailable;
};

const getHotelAvailableAtTime = async ({ hotels, dateStart, dateEnd }) => {
  const result = [];
  await Promise.all(
    hotels.map(async (hotel) => {
      if (
        await isHotelHavingAvailableRoomAtTime({
          hotelId: hotel._id,
          dateStart,
          dateEnd,
        })
      ) {
        result.push(hotel);
      }
    })
  );

  return result;
};

const isHotelHavingAvailableRoomAtTime = async ({
  hotelId,
  dateStart,
  dateEnd,
}) => {
  const unavailableRoomNumber =
    await TransactionService.getUnavailableRoomNumber({
      hotelId,
      dateStart,
      dateEnd,
    });

  const allRoomOfHotel = await HotelService.getRoomsOfHotel(hotelId);
  let totalRoom = 0;
  allRoomOfHotel.map((item) => {
    totalRoom += item.roomNumbers.length;
  });
  if (unavailableRoomNumber.split(",").length === totalRoom) {
    return false;
  } else {
    return true;
  }
};

const isRoomNumberCanBook = (roomNumbers, roomsInBooking) => {
  let result = true;
  roomNumbers.forEach((item) => {
    if (roomsInBooking.includes(item)) {
      result = false;
    }
  });
  return result;
};

module.exports = HotelService;
