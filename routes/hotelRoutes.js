const express = require("express");
const {
  getHotels,
  postFindByCity,
  getAmountOfHotelByType,
  getTop3Rating,
  postFindHotelByFilter,
  getHotelById,
  getAmountOfHotelInCitys,
} = require("../controllers/User/HotelController");
const {
  postBookingRoom,
  postGetAvailableRoom,
} = require("../controllers/User/BookingController");
const router = express.Router();

router.get("/hotels", getHotels);
router.get("/hotels/amount-hotel-by-city", getAmountOfHotelInCitys);
router.post("/hotels/search-by-city", postFindByCity);
router.get("/hotels/amount-by-type", getAmountOfHotelByType);
router.get("/hotels/top-3-rating", getTop3Rating);
router.post("/hotels/search-by-filter", postFindHotelByFilter);
router.post("/hotels/booking", postBookingRoom);
router.post("/hotels/search-room-by-time", postGetAvailableRoom);

router.get("/hotels/:hotelId", getHotelById);

module.exports = router;
