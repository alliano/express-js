export default loggerMiddleware = (req, res, next) => {
  console.log(`Recived request from : ${req.method} ${req.originalUrl}`);
  next();
};
