import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';

import postRoutes from './routes/post.route.js';

import cookieParser from 'cookie-parser';

import commentRoutes from './routes/comment.route.js';


dotenv.config();

//in connect()we directly add the path but in that path there is a password of mongodb which can be shown
//by everyone SO, to hide that we have made one .env file and make one variable called (MONGO) and store that  connection string in that variable. Now to access it in this page there is one package which have to install :- npm i dotenv and need to import.
mongoose
    .connect(process.env.MONGO)
    .then(() => {
         console.log('MongoDB is connected');
    })
    .catch(err =>{
        console.log(err);
    });

const app =  express();

app.use(express.json());

app.use(cookieParser());



// To create and listen a port we have to use method called listen
// In Order to run this and see the application we have run this index.js page.
    //To run that we have to write :- node api/index.js in terminal

    // we can get an error while run this and the reason we are getting an error because this is the 
    // default module type is "commonjs" which,actuallly we are using SO, we have change the 
    // type to modular inside the pakage.json
app.listen(3000, () => {

    //Once it runs it'll be displayed this given content. InCase, Now we want to change the content 
        // While running that node api/index.js command. it will not give us updated content.
        // To fix that we just have to install npm i nodemon

        //after that we can just run nodeman API for index.js only but that is not the best practice 
        // to add a script. THE Best practice is add in the package.json file inside that file there is
        // "Script" so add in this like "dev": "nodemon api/index.js"
        // Now, if we need to run it using node not nodemon So for that we have to write "start": "node api/index.js"
    console.log('Server is running on port 3000!!');
}); 



app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/post', postRoutes);

app.use('/api/comment', commentRoutes);




// MIDDLEWARE:- we use middleware to handle the errors
//next :- It means when we want to go to the next middleware then we're going to use next  
app.use((err, req, res, next) =>{

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({

        success: false,
        statusCode,
        message,
    });
});