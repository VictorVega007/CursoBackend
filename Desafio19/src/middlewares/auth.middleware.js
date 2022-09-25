'use strict';

const auth = (req, res, next) => {
    if (req.session.login) {
        next();
    } else {
        return res.status(401).send('You do not have permission');
    };
};

export default auth;