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




if (!process.env.MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable in .env.local'
  );
}

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('Using existing MongoDB connection');
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true); // Enable query logging in development
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Set the maximum pool size
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
};

export { connectDB, disconnectDB };

// export default connectDB;