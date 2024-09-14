import User from "../models/userModel.js";

export const getUserInfo = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(401).send({ message: "Not Authorized!" });

        const { firstName, lastName, photo, status, payment } = user;

        res.status(200).send({ firstName, lastName, photo, status, payment });
    } catch (error) {
        next(error);
    }
};

// change userName

export const changeName = async (req, res, next) => {
    const { firstName, lastName } = req.body;
    if (!firstName && !lastName) return res.status(400).send({ message: "Body must contain at least one field." })
    
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(401).send({ message: "Not Authorized!" });

        const updatedUser = await User.findByIdAndUpdate(req.user.id, { firstName, lastName }, { new: true });
        if (!updatedUser) return res.status(404).send({ message: "Not found" });

        res.status(200).send(updatedUser);
    } catch (error) {
        next(error);
    }
}

// photo

export const changeUserPhoto = async (req, res, next) => {
    
    if (!req.file) return res.status(404).send({ message: "No photo upload." });

    try {
        const user = await User.findByIdAndUpdate(req.user.id, {photo: req.file.path}, {new: true});
        if (!user) return res.status(401).send({ message: "Not Authorized!" });

        res.status(200).send({ avatar: user.photo });
    } catch (error) {
        next(error);
    }  
};