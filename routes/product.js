const express = require('express');
const router = express.Router();

// Importation d'un modèle Sequelize dans une vue.
// Par défaut, require ira chercher le fichier index.js
const { Product } = require('../models');

router.get('/', async function(req, res){
    try{
        const products = await Product.findAll()
        if(products){
            let newArrayproducts = []
            products.map((product) => {
                if(product.stokck > 0){
                    newArrayproducts.push(product);
                }
            })
            if(newArrayproducts.length > 0){
                res.status(200);
                res.json(newArrayproducts);
            }else{
                res.status(404);
                res.send('Products not found');
            }
        }else{
            res.status(404);
            res.send('Products not found');
        }
    }catch(err) {
        res.status(500);
        res.send('Internal error');
    }
});

module.exports = router;