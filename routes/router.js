const express = require('express');
const { registerView, registerValidation, loginView, logoutView, registerUser, loginUser } = require('../controllers/loginController');
const { movieView } = require('../controllers/movieController');
const { homeView, errorView } = require('../controllers/defaultController');
const { protectRoute, isAdmin } = require("../authentication/protect");
const { dashboardView, adminView } = require("../controllers/dashboardController");
const { addMovie, movieValidation } = require("../controllers/databaseController");
const router = express.Router();

//databaseController routes
router.post('/add-movie', [movieValidation, isAdmin], addMovie);
// router.post('/add-movie', [movieValidation], addMovie); //for debug

//loginController routes
router.get('/register', registerView);
router.get('/login', loginView);
router.get('/logout', logoutView);
router.post('/register', registerValidation(), registerUser);
router.post('/login', loginUser);
router.get('/admin', isAdmin, adminView);
// router.get('/admin', adminView); //for debug

//dashboardController routes
router.get("/dashboard", protectRoute, dashboardView);

//movieController routes
router.get('/movie=:id', movieView);

//defaultController routers
router.get('/', homeView);
router.get('*', errorView);

module.exports = router;
