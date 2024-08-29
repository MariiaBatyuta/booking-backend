import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) return res.status(401).send({ message: "Not authorized." });

    const [bearer, token] = authorizationHeader.split(' ', 2);
    if (bearer !== "Bearer") return res.status(401).send({ message: "Not authorized." });

    jwt.verify(token, process.env.JWT_SECRET, async (error, decode) => {
        if (error) return res.status(401).send({ message: "Not authorized." });
        
        try {
            const userFind = await User.findById(decode.id);
            if (!userFind) return res.status(401).send({ message: "Not authorized." });
            if (userFind.token !== token) return res.status(401).send({ message: "Not authorized." });

            req.user = {
                id: decode.id,
                email: decode.email,
            };

            next();
        } catch (error) {
            next(error);
        }
    })
    
}