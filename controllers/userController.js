const { User } = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('../service/userService');
const JWT_SECRET = process.env.JWT_SECRET;

//creates the user
//upon successful creation, the user is redirected to the user dashboard
//different users have different dashboards with personalized content.
//if the user cannot register, he/she will see the error on the screen.
//in case some other error occours, the user will be shown the default error page(500 Internal server error).
//this is completed and ready for export, no addidtions needed as of now.....

const registerUser = async (req, res) => {
    const userData = req.body;

    if (!userData.email || !userData.password) {
        return res.status(400).json({ error: 'Bad request: Missing required fields' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
        
        const existingUser = await User.findOne({ where: { email: userData.email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        const result = await User.create(userData);

        if (result) {
            const token = jwt.sign({
                id: result.id,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
            }, JWT_SECRET, { expiresIn: '1h' });

            
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000, 
            });

            if (process.env.NODE_ENV !== 'test') {
                res.status(201).redirect('/user/userDashboard');
            } else {
                res.status(201).json({ message: "User registered successfully." });
            }
        } else {
            res.status(400).redirect('/error');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body; 
    try {
        const result = await userService.findByEmail(req);
        if (!result) {
            return res.status(404).json({ error: "No record found with that email id" });
        }

        const isPasswordValid = await bcrypt.compare(password, result.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Please enter correct credentials" });
        }

        const token = jwt.sign({
            id: result.id,
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
        }, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
        });

        
        const environment = process.env.NODE_ENV; 
        if (environment === 'test') {
            return res.status(200).json({ message: 'User logged in successfully (testing environment)' }); 
        } else {
            return res.status(302).redirect('/user/userDashboard'); 
        }

    } catch (error) {
        console.error("Login error:", error); 
        return res.status(500).json({ error: 'Internal server error' }); 
    }
};


//completedd.
const logoutUser = (req, res) => {
    res.clearCookie('token');
    res.redirect('/auth/logout-success');
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
};
