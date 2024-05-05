const express = require('express');
// const authMiddleware = require('./middlewares/auth');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
const router = new express.Router();

const UserController = require('./controllers/UserController');

router.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// router.post('/authenticate', UserController.login);
// router.use(authMiddleware);

router.get('/', (req, res) => {
    return res.json({ info: 'API ORÇAMENTO is running' });
});

// User
router.get('/users/', UserController.getAll);
router.get('/users/:_id', UserController.getById);
router.put('/users/:_id', UserController.update);
router.post('/register', UserController.insert);

module.exports = router;
