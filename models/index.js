const sequelize = require('./_database');

// Importation des models
const Product = require('./Product');
const Tag = require('./Tag');
const User = require('./User');
const ShoppingCart = require('./ShoppingCart');

Product.belongsToMany(Tag, { through: 'ProductTag'});
Tag.belongsToMany(Product, { through: 'ProductTag'});

Product.belongsTo(ShoppingCart)
ShoppingCart.hasMany(Product)

User.hasMany(ShoppingCart);
ShoppingCart.belongsTo(User);

// Synchronisation de la base
sequelize.sync({alter: true});


module.exports = {
    Product: Product,
    Tag: Tag,
    User: User,
    ShoppingCart: ShoppingCart
}
