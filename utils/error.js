module.exports = function (error, res) {
  res.status(500).json({
    status: "Internal Server Error",
    message: error.message,
    result: {},
  });
};
