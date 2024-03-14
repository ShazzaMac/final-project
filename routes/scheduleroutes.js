const express = require('express');
const controller = require('./../controllers/schedulecontrollers');
const { firstMiddleware, secondMiddleware, isAuth } = require('./../middleware/mymiddleware');
const router = express.Router();


//testing the use of middleware
router.get('/', firstMiddleware, secondMiddleware, controller.getSchedule);

router.get('/new', isAuth, controller.getAddNewSnapshot);
router.get('/edit/:id', controller.selectSnapshot);
router.get('/login',  controller.getLogin);
router.get('/logout', controller.getLogout);
router.get('/overview', controller.getSnapshotOverview);
router.get('/terms', controller.getTerms);
router.get('/dashboard', isAuth, controller.getDashboard);
router.get('/signup', controller.getSignup);




router.post('/new', controller.postNewSnapshot);
router.post('/edit/:id', controller.updateSnapshot);
router.post('/del/:id', controller.deleteSnapshot);
router.post('/login', controller.postLogin);
router.post('/signup', controller.postSignup);


            
    
module.exports = router;