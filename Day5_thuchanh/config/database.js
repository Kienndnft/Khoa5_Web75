import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_CONNECT);
    //console.log(connect);
    console.log(`MongoDB connected ${connect.connection.host}`);
  } catch (error) {
    console.log('Error connect MongoDB: ', error);
  }
};

export default connectDb;
