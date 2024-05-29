const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const pool = require('./src/dbconfig/dbconfig');
const loggingRoutes = require('./src/routes/loggingRoute');

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin:'http://localhost:3000',
    credentials: true,
  }),
);

const port = process.env.PORT || "3001";

app.use('/api/logging', loggingRoutes);

app.listen(port, (err)=>{
    if(err){
        throw err;
    }
    else{
        console.log(`Server is running at port: ${port}`);
    }
});