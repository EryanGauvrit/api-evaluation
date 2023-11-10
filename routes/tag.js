const express = require('express');
const router = express.Router();

const { Tag } = require('../models');
const { authenticateUser } = require('../middlewares/auth');

router.get('/', async function(req, res){
    try{
        const tags = await Tag.findAll()
        if(tags[0]){
            res.status(200);
            res.json(tags);
        }else {
            res.status(404);
            res.send('Tags not found');
        }
    }catch(err) {
        res.status(500);
        res.send('Internal error');
    }
});

router.get('/:id', async function(req, res){

    try{
        const tag = await Tag.findByPk(req.params.id)
        if(tag){
            res.status(200);
            res.json(tag);
        }else {
            res.status(404);
            res.send('Tag not found');
        }
    }catch(err) {
        res.status(500);
        res.send('Internal error');
    }
});

router.post('/', authenticateUser, async (req, res) => {
    if(!req.user.admin){
        res.status(401);
        res.send('Not authorized');
        return;
    }
    const { name } = req.body
    if(!name){
        res.status(400);
        res.send('All fields are required');
        return;
    }
    try {
        Tag.create({
            name: name,
        })
        .then((task) => {
            res.status(201);
            res.send('Created');
        })
        .catch((err) => {
            throw err;
        })
    }catch(err) {
        res.status(500);
        res.send('Internal error');
    }
})

router.patch('/:id', authenticateUser, async (req, res) => {
    const { name } = req.body;
    const id = req.params.id;

    if(!req.user.admin){
        res.status(401);
        res.send('Not authorized');
        return;
    }

    if(!name || !id){
        res.status(400);
        res.send('All fields are required');
        return;
    }
    try {
        const isExist = await Tag.findByPk(id);
        if(!isExist){
            res.status(404);
            res.send('Tag not found');
        }
        Tag.update({
            name: name,
        }, {
            where: {
                id: id
            }
        })
        .then((task) => {
            res.status(201);
            res.send('Updated');
        })
        .catch((err) => {
            throw err;
        })
    }catch(err) {
        res.status(500);
        res.send('Internal error');
    }
})

router.delete('/:id', authenticateUser, async (req, res) => {
    const id = req.params.id;

    if(!req.user.admin){
        res.status(401);
        res.send('Not authorized');
        return;
    }

    try {
        const isExist = await Tag.findByPk(id);
        if(!isExist){
            res.status(404);
            res.send('Tag not found');
        }
        Tag.destroy({
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