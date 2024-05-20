export default apiTokenMiddleware = (req, res, next) => {
  if (!req.header("X-API-TOKEN")) {
    res.status(401);
    res
      .json({
        message: "Token is required :(",
      })
      .end();
  } else {
    res.status(200);
    res
      .json({
        message: "Successfully authenticate :)",
      })
      .end();
    next();
  }
};
