export default headerMiddleware = (req, res, next) => {
    res.set({
        "X-POWERED-BY": "express",
        "Author": "Alliano"
    }).status(201).end();
    next();
}