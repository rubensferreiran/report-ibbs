/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const config = process.env;

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
    ) {
        token = req.headers.authorization.slice(7);
    } else {
        token =
            req.body.token || req.query.token || req.headers['authorization'];
    }

    if (!token) {
        return res.status(403).json({ errors: 'Nenhum token fornecido.' });
    }

    jwt.verify(token, config.TOKEN_KEY, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(403).json({
                errors: 'Falha na autenticação do token.',
            });
        }
        req.decoded = decoded;
        next();
    });
};
