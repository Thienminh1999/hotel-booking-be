const HotelService = require("../../services/HotelService");
const { errorHandle } = require("../../utils/errorHandler");

exports.getHotels = async (req, res, next) => {
  try {
    const hotels = await HotelService.findAllHotel();
    res.status(200).send(hotels);
  } catch (error) {
    errorHandle(error, res);
  }
};

exports.postFindByCity = async (req, res, next) => {
  try {
    const cityfilter = req.query.city;
    const hotels = await HotelService.findAllHotel(cityfilter);
    res.status(200).send(hotels);
  } catch (error) {
    errorHandle(error, res);
  }
};

exports.getAmountOfHotelByType = async (req, res, next) => {
  try {
    const amountOfHotel = await HotelService.getAmountHotelByType();
    res.status(200).send(amountOfHotel);
  } catch (error) {
    errorHandle(error, res);
  }
};

exports.getTop3Rating = async (req, res, next) => {
  try {
    const hotels = await HotelService.getTop3Rating();
    res.status(200).send(hotels);
  } catch (error) {
    errorHandle(error, res);
  }
};

exports.postFindHotelByFilter = async (req, res, next) => {
  try {
    const city = req.body.city;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const numberPeople = Number(req.body.numberPeople);
    const room = Number(req.body.room);
    const hotels = await HotelService.postFindHotelByFilter({
      city: city,
      startDate: startDate,
      endDate: endDate,
      numberPeople: numberPeople,
      room: room,
    });
    res.status(200).send(hotels);
  } catch (error) {
    errorHandle(error, res);
  }
};

exports.getHotelById = async (req, res, next) => {
  try {
    const hotelId = req.params.hotelId;
    const hotel = await HotelService.getHotelById(hotelId);
    res.status(200).send(hotel);
  } catch (error) {
    errorHandle(error, res);
  }
};

exports.deleteHotelById = async (req, res, next) => {
  try {
    await HotelService.deleteHotelById(req.params.hotelId);
    res.status(204).send({ message: "No content" });
  } catch (error) {
    errorHandle(error, res);
  }
};

exports.postCreateHotel = async (req, res, next) => {
  try {
    const newHotel = await HotelService.createHotel({
      name: req.body.name,
      type: req.body.type,
      city: req.body.city,
      address: req.body.address,
      distance: req.body.distance,
      photos: req.body.photos,
      desc: req.body.desc,
      shortDesc: req.body.shortDesc,
      featured: req.body.featured,
      title: req.body.title,
      tag: req.body.tag,
      freeCancel: req.body.freeCancel,
      cheapestPrice: 0,
      rateText: "Exceptional",
    });

    res.status(200).send(newHotel);
  } catch (error) {
    errorHandle(error, res);
  }
};

exports.getAmountOfHotelInCitys = async (req, res, next) => {
  try {
    const result = await HotelService.getAmountOfHotel();
    res.status(200).send(result);
  } catch (error) {
    errorHandle(error, res);
  }
};

exports.updateHotel = async (req, res, next) => {
  try {
    const result = await HotelService.updateHotelById(req.body);
    res.status(200).send(result);
  } catch (error) {
    errorHandle(error, res);
  }
};
