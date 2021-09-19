const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
    dialect: "sqlite",
    logging: false,
    storage: "bot.db",
});

const Pins = require("../models/pins/Pins.js")(sequelize, Sequelize.DataTypes);

const force = process.argv.includes("--force") || process.argv.includes("-f");

sequelize.sync({ force }).catch(console.error);
