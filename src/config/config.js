import dotenv from 'dotenv';
dotenv.config();

export default {
  dbURI: process.env.DB_URI,
  sessionSecret: process.env.SESSION_SECRET,
  jwtSecret: process.env.JWT_SECRET
};
