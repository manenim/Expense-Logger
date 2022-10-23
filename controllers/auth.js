import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
//register

export const register = async (req, res) => {
    const { username, email, password } = req.body
    const existingUser = await User.findOne({ email: req.body.email }).exec()
    console.log(existingUser)
    if(existingUser) return res.status(400).json({message: "you are already registered"})
    console.log(password, "from password")
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log(hashedPassword)
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword
    })
    console.log(newUser)
    try{
        res.status(200).json('user added succesfully')
    }
    catch(err){
        res.status(500).json(err)
    }

}


//login

export const login = async (req, res) => {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email: email }).exec()
    console.log(existingUser)
    if(!existingUser) return res.status(400).json('please you need to register')
    try {
        const match = await bcrypt.compare(password, existingUser.password)
        if(!match) return res.status(400).json('wrong credentials')
        console.log(match)

        //CREATE ACCESSTOKEN

        // jwt.sign is a method that accepts three arguments (payload, secret, options)
        const accessToken = jwt.sign({
            email: existingUser.email,
            id: existingUser._id,
            username: existingUser.username
        },
        //ACCESS_KEY
        process.env.ACCESS_KEY,
        //options
        { expiresIn: '1h' }
        )
        console.log(accessToken)

        //CREATE REFRESH TOKEN
        const refreshToken = jwt.sign({
            email: existingUser.email,
            username: existingUser.username
        },
        //REFRESH_KEY
        process.env.REFRESH_KEY,

        //options
        { expiresIn: '7d' }

        )
        //SAVE REFRESH TOKEN TO DB
        existingUser.refreshToken = refreshToken
        // save the refeshtoken to the database
        const savedUser = await existingUser.save()

        //SEND REFRESH TOKEN TO CLIENT
        res.cookie('refreshToken', refreshToken, {httpOnly: true, path: '/api/auth', maxAge: 7*24*60*60*1000, sameSite: 'none', secure: true})
        res.status(200).json(accessToken)
        
    } catch (error) {
        res.status(400).json(error)
    }
}

export const refreshToken = async (req, res) => {
    const cookie = req.cookies
    if(!req.cookie?.refreshToken) return res.status(401) // unauthorized
    const refreshToken = cookie.refreshToken

    const user = await User.findOne({ refreshToken }).exec()
    if(!user) return res.status(400).json('user not found') 

    //verify jwt
    jwt.verify(
        refreshToken, 
        process.env.REFRESH_KEY,
        (err, decoded) => {
            if(err || user.username !== decooded.username) return res.status(403) // FORBIDDEN
            // create new accesstoken
            const accesstoken = jwt.sign({
                username: decoded.username,
                email: decoded.email,
                id: decoded._id
            }, 
            process.env.ACCESS_KEY,
            {expiresIn: '1h'}
            )

            res.status(200).json({accesstoken})
        }
        )
}


//logout

export const logout = async (req, res) => {
    const cookie = req.cookie

    console.log(req.cookies)

    if(!cookie?.refreshToken) return res.status(200).json("you are already logged out")
    
    const refreshToken = cookie.refreshToken

    const user = await User.findOne({ refreshToken: refreshToken }).exec()
    if(!user) return res.status(400).json('user not found')
    console.log(user)
    // try {
    //     user.refreshToken = null
    //     const savedUser = await user.save()
    //     res.status(200).json('logged out')
    // } catch (error) {
    //     res.status(400).json(error)
    // }
}