import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {

    try {
        let token = req.header("Authorization"); // grabbing the token from the frontend

        if(!token) {
            return res.status(403).send("Access Denied"); 
        }

        if(token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft(); // token will be placed after a space after bearer
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET); // checking if token and secret string is matching or not
        req.user = verified;
        next();
    }
    catch(err) {
        res.status(500).json({error: err.message});
    }
};