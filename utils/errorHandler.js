const errorHandle = (err, res) => {
  console.error("Error occurred:", err);
  res.status(500).json({ error: "Internal Server Error" });
};

module.exports = {
  errorHandle,
};
