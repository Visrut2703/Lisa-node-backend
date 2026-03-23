import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import questionsModel from '../schema/questionsSchema.js';
import responseModel from  '../schema/interviewSchema.js';
import userMdel from '../schema/userSchema.js';

const LoginRouter = express.Router();

LoginRouter.post('/login', async(req, res)=>{
    const {email, password} = req.body;
    console.log(email);
    const data = await userMdel.find({email: email});
    if(data.length > 0) {
        const isMatch = await bcrypt.compare(password, data[0].password);
        if(isMatch){
            const token = jwt.sign(
                { id: data[0]._id, email: data[0].email, role: data[0].role || 'user' }, 
                process.env.JWT_SECRET || 'fallback_secret_for_dev', 
                { expiresIn: '24h' }
            );
            res.json({
                status: true, 
                token, 
                email: data[0].email, 
                role: data[0].role || 'user',
                name: data[0].email.split('@')[0]
            });
        }
        else {
            res.status(401).json({status: false, message: 'Invalid credentials'});
        }
    }
    else {
        res.status(404).json({status: false, message: 'User not found'});
    }
});

LoginRouter.post('/signup', async(req, res)=>{
    const {email, password} = req.body;
    const data = await userMdel.find({email: email});
    if(data.length > 0) {
        res.status(400).json({status: false, message: 'Email already in use!'});
    }
    else {
        const hashedPassword = await bcrypt.hash(password, 10);
        await userMdel.insertMany([{email, password: hashedPassword}]);
        res.json({status: true, message: 'Signed up successfully'});
    }
});

export default LoginRouter;