const validateSession = (req, res, next) => {
    if (req.session.passport) {
        return next()
    }
    res.redirect('/users/login')
}

module.exports = validateSession