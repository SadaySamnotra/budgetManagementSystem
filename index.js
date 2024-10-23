require('dotenv').config();
const {sequelize} = require('./models/index');
const express = require('express');
const authRouter = require('./routers/auth');
const staticRouter = require('./routers/staticRouter');
const userRouter = require('./routers/userRouter');
const cookieParser = require('cookie-parser');
const apiRouter = require('./routers/apiRouter');
const budgetRouter = require('./routers/budgetRouter');

const app = express();
const PORT = 5500;

//middlewares.
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static('public'));
app.set('views','./views');
app.set('view engine','pug');
app.use(cookieParser());

//routes.
app.use('/',staticRouter);
app.use('/auth',authRouter);
app.use('/user',userRouter);
app.use('/api',apiRouter);
app.use('/budget',budgetRouter);

if(process.env.NODE_ENV!=='test'){
    sequelize.authenticate() 
    .then(() => {
        return app.listen(PORT, () => {
            console.log(`The server is running on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Unable to connect with the database', error);
    });
}

module.exports=app;
