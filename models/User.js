const sequelize = require('./_database');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
})

module.exports = User