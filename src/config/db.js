import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Connected succedssfully to mongodb ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error in MongoDB Database is ${error}`)
    }
};

export default connectDB;