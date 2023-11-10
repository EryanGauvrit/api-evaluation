const express = require('express');
const router = express.Router();

const { ShoppingCart } = require('../models');
const { authenticateUser } = require('../middlewares/auth');

router.get('/', authenticateUser, async function(req, res){
    userId = req.user.id;
    try{
        const cart = await ShoppingCart.findOne({ where : { userId: userId }})
        if(cart[0]){
            res.status(200);
            res.json(cart);
        }else {
            res.status(404);
            res.send('Cart is empty');
        }
    }catch(err) {
        res.status(500);
        res.send('Internal error');
    }
});

module.exports = router;