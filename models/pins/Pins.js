module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Pins", {
        guild_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        channel_id: {
            type: DataTypes.STRING,
            defaultValue: 0,
            allowNull: true,
        },
        mod_only: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });
};