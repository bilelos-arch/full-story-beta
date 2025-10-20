export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/story',
  jwtSecret: process.env.JWT_SECRET || 'defaultSecret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
});