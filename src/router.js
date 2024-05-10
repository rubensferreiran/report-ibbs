const express = require('express');
// const authMiddleware = require('./middlewares/auth');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
const router = new express.Router();

const UserController = require('./controllers/UserController');
const OfficeController = require('./controllers/OfficeController');
const MembersController = require('./controllers/MembersController');

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

// Office
router.get('/office/', OfficeController.getAll);
router.get('/office/:_id', OfficeController.getById);
router.put('/office/:_id', OfficeController.update);
router.post('/office', OfficeController.insert);
router.delete('/office/:_id', OfficeController.delete);

// Members
router.get('/members/', MembersController.getAll);
router.get('/members/:_id', MembersController.getById);
router.get('/members/search', MembersController.getSearch);
router.put('/members/:_id', MembersController.update);
router.post('/members', MembersController.insert);
router.patch('/members/:_id', MembersController.delete);

module.exports = router;
