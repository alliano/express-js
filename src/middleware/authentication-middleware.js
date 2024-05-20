export default authenticationMiddleware = (req, res, next) => {
    if(!req.header("X-API-TOKEN")) {
        res.status(400);
        res.json({
            message: "token is required !"
        }).end();
    }else if(req.header("X-API-TOKEN").substring(0, 5).toLowerCase() !== "barer"){
        res.status(400);
        res.json({
            message: "token is not valid !"
        })
    } else {
        res.status(200);
        res.json({
            message: "successfully authentiate :)",
        }).end();
        next();
    }
}