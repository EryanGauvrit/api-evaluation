const sequelize = require('./_database');
const { DataTypes } = require('sequelize');

const ShoppingCart = sequelize.define('shopping_cart', {
    quantity : {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
})

module.exports = ShoppingCart