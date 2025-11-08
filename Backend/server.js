const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const path = require('path');
require('dotenv').config({ path: path.join(__dirname,'config.env') });

console.log('Mongo URI:', process.env.MONGO_URI);

const IndexRoute = require("./Routers/index")
const connectDatabase = require("./Helpers/database/connectDatabase")
const customErrorHandler = require("./Middlewares/Errors/customErrorHandler")

dotenv.config({
    path:  './Config/config.env'
})

connectDatabase()

const app = express() ;

app.use(express.json())

const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'bloggy-lac.vercel.app',  // ✅ Correct Vercel Frontend URL
];



app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use("/",IndexRoute)

app.use(customErrorHandler)

const PORT = process.env.PORT || 5000 ;

app.use(express.static(path.join(__dirname , "public") ))

const server = app.listen(PORT,()=>{

    console.log(`Server running on port  ${PORT} : ${process.env.NODE_ENV}`)

})

process.on("unhandledRejection",(err , promise) =>{
    console.log(`Logged Error : ${err}`)

    server.close(()=>process.exit(1))
})
