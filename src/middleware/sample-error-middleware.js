export default errorMiddleware = (error, req, res, next) => {
  res.status(500).json({
    message: `something wen wrong ${error.message}`
  });
};
