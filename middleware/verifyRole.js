function verifyRole(req, res, next) {
    if (req.role === 'Admin') {
        next()
    } else {
        res.status(403).send("Not Authorized")
    }
}
module.exports = verifyRole;