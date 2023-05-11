const express = require('express');
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser');


const productRouter = require('./routers/ProductRouter');
const categoryRouter = require('./routers/CategoryRouter');
const orderRouter = require('./routers/OrderRouter');
const userRouter = require('./routers/UserRouter');
const { authJwt } = require('./helper/jwt');
const { errorhandler } = require('./helper/error-handler');

const app = express()

//DB config
const db = require('./config/db').MongoURI;

//DATABASE connection
mongoose.connect(db, {useNewUrlParser: true})
.then(() => console.log('MongoDB Connected😌😌😇'))
.catch(err => console.log(err));

const api = process.env.API_URL

// MIDDLEWARE
app.use(bodyParser.json());
app.use(morgan('tiny'));

app.use(authJwt());
app.use(errorhandler);

// product route // 
app.use(`${api}/products`, productRouter);

// category route //
app.use(`${api}/category`,categoryRouter);

// order route //
app.use(`${api}/order`,orderRouter);

// User route  //
app.use(`${api}/user`,userRouter);

app.listen(PORT,()=> console.log(`Server start on port ${PORT}`));