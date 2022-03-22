const routes = require("../routes")
module.exports = function (app) {
    app.use("/api/v1", routes)
}