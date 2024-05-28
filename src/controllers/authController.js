import { comparePassword,hashPassword } from '../helpers/authHelper.js';
import authModel from '../models/authModel.js';
import adminSchema from '../models/authModel.js'
import JWT from 'jsonwebtoken' 

// Method- Post for Login 
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        
        //validation 
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'invalid email or password'
            })
        }
        
        //check user
        const user = await adminSchema.findOne({ email })
        
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'user not found please make a account'
            })
        }

        const match = await comparePassword(password, user.password)
        
        if (!match) {
            return res.status(200).send({
                success: false,
                message: 'invalid password'
                
            })
        }

        //create a token

        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).send({
            success: true,
            message: 'login successfully',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role:user.role,
            },
            token,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in Login Time',
            error
        });
    }
};



export const registerController = async (req, res) => {
    try {
        const { email, password} = req.body;

        //add some validation over here
        if (!email) {
            return res.send({message:'Email Must be Required'})
        }if (!password) {
            return res.send({message:'password Must be Required'})
        }

        const existingUser = await authModel.findOne({ email });
        
        //check if user already login (existing user)
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'Alredy Register so Login Now',
            })
        }

        //register user (New user)
        const hashedPassword = await hashPassword(password)

        //to save this password
        const user = await new authModel({ email,password: hashedPassword}).save();

        res.status(201).send({
            success: true,
            message: 'User Register Successfully',
            user
        })
        

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Register Form',
            error
        })
    }
};
