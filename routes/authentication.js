const express = require('express');
const { User } = require('../models');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { authenticateUser } = require('../middlewares/auth');


function generateToken(id){
    return jwt.sign({id:id}, process.env.JWT_SECRET, {expiresIn: '1h'});
}

// get all accounts 
router.get('/account', authenticateUser, async (req, res) => { 
    if(!req.user.admin){
        res.status(401);
        res.send('Not authorized');
        return;
    }
    try {
        const users = await User.findAll();
        if(users[0]){
            res.status(200);
            res.json(users);
        }else {
            res.status(404);
            res.send('Users not found');
        }
        
    } catch (err) {
        res.status(500);
        res.send('Internal error');
    }
})

// Signup route
router.post('/signup', (req, res) => {
    const { email, password } = req.body;
    const admin = false;
    if(!email || !password){
        res.status(400)
        res.send('All fields are required')
        return;
    }
  try {
        User.create({
            email: email,
            password: password,
            admin: admin,
        })
        .then((user) => {
            res.status(200)
            res.send('User account created')
        })
        .catch((err) => {
            throw err;
        })
    } catch (err) {
        res.status(500);
        res.send('Internal error');
    }
});

// Admin account creation
router.post('/admin-creation', authenticateUser, (req, res) => {
    if(!req.user.admin){
        res.status(401);
        res.send('Not authorized');
        return;
    }
    const { email, password } = req.body;
    const admin = true;
    if(!email || !password){
        res.status(400)
        res.send('All fields are required')
        return;
    }
  try {
        User.create({
            email: email,
            password: password,
            admin: admin,
        })
        .then((user) => {
            res.status(200)
            res.send('Admin user account created')
        })
        .catch((err) => {
            throw err;
        })
    } catch (err) {
        res.status(500);
        res.send('Internal error');
    }
});

// login and call to token generation function
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        res.status(400)
        res.send('All fields are required')
        return;
    }
    try {
        const userExist = await User.findOne({ where: { email: email}})
        if(!userExist){
            res.status(404)
            res.send('email or password are invalid')
            return;
        }
        const validation = await bcrypt.compare(password, userExist.password);
        
        if(validation){
            res.status(200);
            res.json({
                message: 'user authentication successful',
                token: `Bearer ${generateToken(userExist.id, userExist.email, userExist.admin)}`,
            })
        }else{
            res.status(404)
            res.send('email or password are invalid')
        }
    } catch (err) {
        res.status(500);
        res.send('Internal error');
    }
})

module.exports = router;
