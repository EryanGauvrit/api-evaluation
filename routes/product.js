const express = require('express');
const router = express.Router();

const { Product, Tag } = require('../models');
const { authenticateUser } = require('../middlewares/auth');
const { Op } = require("sequelize");

// get all items
router.get('/', async function(req, res){
    try{
        const products = await Product.findAll({ 
            attributes: ['id', 'title', 'price', 'stock'], 
            include: {
                model : Tag,
                through: 'producttag',
                as: 'tags'
            },
            // offset: 5, 
            // limit: 5,
            where: {
                stock: {
                    [Op.gt]: 0
                }
            }
        })
        if(products[0]){
            res.status(200);
            res.json(products);
        }else{
            res.status(404);
            res.send('Products not found');
        }
    }catch(err) {
        res.status(500);
        res.send('Internal error');
    }
});

// Get one item 
router.get('/:id', async function(req, res){

    try{
        const product = await Product.findOne({
            where: {
                id : req.params.id
            },
            include: {
            model : Tag,
            through: 'producttag',
            as: 'tags'
            }
        })
        if(product){
            res.status(200);
            res.json(product);
        }else {
            res.status(404);
            res.send('Product not found');
        }
    }catch(err) {
        res.status(500);
        res.send('Internal error');
    }
});

// Creation request
router.post('/', authenticateUser, async (req, res) => {
    const { title, price, stock, description, tags } = req.body;

    if(!req.user.admin){
        res.status(401);
        res.send('Not authorized');
        return;
    }

    if(!title || typeof(price) !== 'number' || typeof(stock) !== 'number' || !description || !tags || !tags[0]){
        res.status(400);
        res.send('All fields are required');
        return;
    }
    try {
        const tagsExist = await Tag.findAll({ id: tags});
        if(!tagsExist && !tagsExist[0]){
            res.status(400);
            res.send('Tags do exist');
            return;
        }
        
        const product = await Product.create({
            title: title,
            price: price,
            stock: stock,
            description: description,
        });

        await product.addTag(tagsExist);

        res.status(201);
        res.send('Created');
    }catch(err) {
        res.status(500);
        res.send('Internal error');
    }
})

// update item
router.patch('/', authenticateUser, async (req, res) => {
    const { title, price, stock, description, tags } = req.body;

    if(!req.user.admin){
        res.status(401);
        res.send('Not authorized');
        return;
    }

    try {
        const tagsExist = await Tag.findAll({ id: tags});
        if(!tagsExist && !tagsExist[0]){
            res.status(400);
            res.send('Tags do exist');
            return;
        }
        
        const product = await Product.update({
            title: title,
            price: price,
            stock: stock,
            description: description,
        });

        await product.addTag(tagsExist);

        res.status(201);
        res.send('Updated');
    }catch(err) {
        res.status(500);
        res.send('Internal error');
    }
})

// delete item
router.delete('/:id', authenticateUser, async (req, res) => {
    const id = req.params.id;

    if(!req.user.admin){
        res.status(401);
        res.send('Not authorized');
        return;
    }

    try {
        const isExist = await Product.findByPk(id);
        if(!isExist){
            res.status(404);
            res.send('Product not found');
        }

        Product.destroy({
            where: {
                id: id
            }
        })
        .then(() => {
            res.status(201);
            res.send('Deleted');
        })
        .catch((err) => {
            throw err;
        })
    }catch(err) {
        res.status(500);
        res.send('Internal error');
    }
})

module.exports = router;