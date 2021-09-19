const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
    dialect: "sqlite",
    logging: false,
    storage: "./db/bot.db",
});

const Pins = require("../models/pins/Pins.js")(sequelize, Sequelize.DataTypes);

module.exports = { Pins };
