// Ce fichier contient les middleware relatif à l'authentification
const  jwt = require("jsonwebtoken");
const { User } = require("../models");

const intToBool = (number) => {
    if(Number(number) === 1){
        return true;
    }else {
        return false;
    }
}

function authenticateUser(req, res, next){
    const headerAuth = req.headers.authorization;
    if(headerAuth && headerAuth.startsWith('Bearer')){
        const token = headerAuth.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
            if(err){
                res.status(401);
                res.send("Not authorized");
                return;
            }
            const userId = decode.id;
            await User.findByPk(userId)
                .then((userDb) => {
                    if(!userDb){
                        res.status(401);
                        res.json(userDb);
                        return;
                    }
                    req.user = {
                        id : userDb.id,
                        admin : intToBool(userDb.admin)
                    };
                    next();
                    
                })
                .catch((err) => {
                    console.log(err)
                    res.status(401);
                    res.send("Not authorized");
                })
        })
    }else{
        res.status(401);
        res.send("Not authorized");
    }
}

module.exports = {
    authenticateUser: authenticateUser
}