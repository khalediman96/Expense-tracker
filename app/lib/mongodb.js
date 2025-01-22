import mongoose from 'mongoose';

// if (!process.env.MONGODB_URI) {
//   throw new Error('Please add your MongoDB URI to .env.local');
// }

// const connectDB = async () => {
//   try {
//     if (mongoose.connection.readyState === 0) {
//       await mongoose.connect(process.env.MONGODB_URI);
//       console.log('Connected to MongoDB');
//     }
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     throw error;
//   }
// };


// export default connectDB;



const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('Using existing MongoDB connection');
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      poolSize: 10,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default connectDB;