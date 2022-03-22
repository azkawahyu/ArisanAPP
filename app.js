const express = require("express");
const app = express();
require("./startup")(app);

app.get('/', (req, res) => {
    res.send('Connected')
})

module.exports = app

