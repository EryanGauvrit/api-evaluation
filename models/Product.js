const sequelize = require('./_database');
const { DataTypes } = require('sequelize');

const Product = sequelize.define('product', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

module.exports = Product