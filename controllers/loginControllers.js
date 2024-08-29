import User from "../models/userModel.js";
import {userLoginSchema} from "../schema/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userLogin = async (req, res, next) => {
    const { email, password } = req.body;

    if (Object.keys(req.body).length === 0) return res.status(400).send({ message: "Email and password is required." });

    try {
        const { error } = userLoginSchema.validate({ email, password });
        if (error) return res.status(400).send({ message: error.message });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(401).send({ message: "Email or password is wrong." });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!user) return res.status(401).send({ message: "Email or password is wrong." });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const userWithToken = await User.findByIdAndUpdate(user._id, { token }, { new: true }).select('-password');

        res.status(200).send(userWithToken);
    } catch (error) {
        next(error);
    }
    
};

export const userLogout = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(401).send({ message: "Not authorized." });

        await User.findByIdAndUpdate(user._id, { token: null });

        res.status(200).send({ message: "Logout successful." })
    } catch (error) {
        next(error);
    }
};

// google
export const authGoogle = (_, res) => {
    try {
        const params = queryString.stringify({
            client_id: process.env.GOOGLE_CLIENT_ID,
            redirect_uri: "web-link/api/users/auth/google/callback", 
            response_type: "code",
            scope: "profile email",
            prompt: "consent",
            access_type: "offline",
        });

        res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
    } catch (error) {
        console.error('Error in Google OAuth redirection:', error.message);
        res.status(500).send('Error redirecting to Google OAuth');
    }
};

export const callbackGoogle = async (req, res, next) => {
    const { code } = req.query;

    try {
        if (!code) {
            throw new Error("Authorization code not provided");
        }

        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: "web-link/api/users/auth/google/callback", 
            grant_type: 'authorization_code',
        });
        const { access_token } = tokenResponse.data;

        const userResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        const { name, email } = userResponse.data;

        const user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
            });
        };
        
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await User.findByIdAndUpdate(user._id, { token }, { new: true });

        res.redirect(`web-link/login/google?token=${token}`); 
    } catch (error) {
        console.error('Error during Google OAuth callback:', error.message);
        next(error);
    }
};