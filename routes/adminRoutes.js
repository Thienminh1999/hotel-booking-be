const express = require("express");
const {
  getCommonInfo,
  getAllTransaction,
  getLatestTransaction,
} = require("../controllers/Admin/AdminDashboardController");
const {
  postCreateHotel,
  deleteHotelById,
  updateHotel,
} = require("../controllers/User/HotelController");
const {
  postAddRoomIntoHotel,
  getAllRooms,
  deleteRoom,
  updateRoom,
  getRoomDetails,
} = require("../controllers/Admin/RoomController");
const router = express.Router();

router.get("/admin/dashboard-common-info", getCommonInfo);
router.post("/admin/hotels/create", postCreateHotel);
router.post("/admin/rooms/create", postAddRoomIntoHotel);
router.get("/admin/rooms", getAllRooms);
router.get("/admin/rooms/:roomId", getRoomDetails);
router.delete("/admin/rooms/:roomId", deleteRoom);
router.delete("/admin/hotel/:hotelId", deleteHotelById);
router.post("/admin/hotel", updateHotel);
router.post("/admin/room", updateRoom);
router.get("/admin/transactions", getAllTransaction);
router.get("/admin/transactions/latest/:amount", getLatestTransaction);

module.exports = router;
