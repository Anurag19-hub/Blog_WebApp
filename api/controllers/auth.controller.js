//Here we use async() because we need sometime to actually get the results from the MongoDb Because we are signing up the user, it takes time and we need to wait for that then  we will send the response to the user so it shoud be synchronous

import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';



export const signup = async(req, res, next) =>{

    //console.log(req.body);

    const { username, email, password} = req.body;

    if(!username || !email || !password || username === '' || email === '' || password === '' )
    {
        //return res.status(400).json({message: 'All fields are required'});

        next(errorHandler(400, 'All fields are required'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User  ({

        username,
        email,
        password: hashedPassword,
    });

    try 
    {
        await newUser.save();
        res.json('Signup Successful');
    } catch (error) {
      
        //res.status(500).json({ message: error.message });
        next(error);
    }
};

export const signin = async(req, res, next) =>{

    const { email, password } = req.body;

    if(!email || !password || email == '' || password == '')
    {
        next(errorHandler(400, 'All fields are required'));
    }

    try {

        const validUser = await User.findOne( { email } );
        if(!validUser)
        {
            return next(errorHandler(404, 'User not found'));
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword)
        {
            return next(errorHandler(400, 'Invalid Password'));
        }

// Now if both email and password are correct then we need to authenticate the user. For that we are going to do that by using a package called Json web token So, inside our root directory we need to install a package called Json web token and then once you do that install the library is: 

// - npm i josnwebtoken

        //-----> TO Create Token

        const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET);

        //To not to send the password to the server even the hash password
        const { password: pass, ...rest } = validUser._doc;

        res.status(200).cookie('access_token', token, {
            
            httpOnly: true}).json(rest);


    } catch (error) {

        next(error);
    }
};

export const google = async(req, res, next) => {

    const { email, name, googlePhotoUrl } = req.body;

    try {

        const user = await User.findOne({ email });

        if(user)
        {
            const token = jwt.sign( 
                {id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET );
                const { password, ...rest } = user._doc;

            res.status(200).cookie('access_token', token, {

                httpOnly: true,
            }).json(rest);
        }
        else
        {
            const generatedPassword = 
                Math.random().toString(36).slice(-8) + 
                Math.random().toString(36).slice(-8);

            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            const newUser = new User({

                username:
                 name.toLowerCase().split(' ').join('') + 
                 Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
                //Anurag Jobanputra => anuragjobanputra1928


            });
            
            await newUser.save();
            const token = jwt.sign( 
                {id: newUser._id, isAdmin: newUser.isAdmin}, process.env.JWT_SECRET );

            const { password, ...rest } = newUser._doc;

            res.status(200).cookie('access_token', token, {

                httpOnly: true,
            }).json(rest);
        }


    } catch (error) {
        
        next(error)
    }
}