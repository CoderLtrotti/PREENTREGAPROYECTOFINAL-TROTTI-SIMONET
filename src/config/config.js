import dotenv from 'dotenv';
dotenv.config();

export default {
  dbConnectionString: process.env.DB_CONNECTION_STRING,
  secretKey: process.env.SECRET_KEY,
  sessionSecret: process.env.SESSION_SECRET,
};
