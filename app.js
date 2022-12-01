const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express() // Initializing express
app.use(cookieParser())
const dotenv = require('dotenv').config({ path: '.env' })
const connectDB = require('./config/db')

connectDB()

const { errorHandler } = require('./middlewares/error-middleware')

// routes
const userRouter = require('./routes/user')

const port = process.env.PORT || 5000;
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Access']
}))

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', userRouter);


app.use(errorHandler)

// Listen
app.listen(port, () => console.log(`Server connected `))
