const sequelize = require('./_database');
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const User = sequelize.define('user', {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true
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

User.beforeCreate(async (user) => {
    const hash = await bcrypt.hash(user.password, parseInt(process.env.BCRYPT_SALT_ROUND || ""));
    user.password = hash;
})
User.checkPassword = async (password, originel) => {
    return await bcrypt.compare(password, originel)
}

module.exports = User