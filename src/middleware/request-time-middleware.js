export default currentRequestTimeMiddleware = (req, res, next) => {
    req.currentTime = Date.now();
    next(); // next untuk melanjutkan filter selanjutnya atau middleware selanjutnya
}