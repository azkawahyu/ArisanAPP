const catchError = require("../utils/error");

module.exports = {
  validate: (schema) => {
    return async (req, res, next) => {
      try {
        const body = await req.body;
        const { error } = schema.validate(body);
        if (error)
          return res.status(400).json({
            status: "Bad Request",
            message: error.message,
          });
        next();
      } catch (error) {
        catchError(error, res);
      }
    };
  },
};