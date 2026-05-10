var express = require('express');
var router = express.Router();
var recipeCon = require('../controller/recipeController');
var adminCon = require('../controller/adminController');
var loginModel = require('../model/admin-login');
var userCon = require('../controller/userController');
var { check, validationResult } = require('express-validator');



/* GET home page. */
router.get('/', recipeCon.homePage);

router.get('/recipe/:id', recipeCon.exploreRecipe);

router.get('/categories', recipeCon.exploreCategories);
router.get('/categories/:name', recipeCon.exploreCategoriesById);

router.get('/search', recipeCon.searchRecipeShow);
router.post('/search', recipeCon.searchRecipe);

router.get('/search/:cname', recipeCon.searchRecipeShow);
router.post('/search/:cname', recipeCon.searchRecipe);

router.get('/explore-latest', recipeCon.exploreLatest);

router.get('/explore-random', recipeCon.exploreRandom);

router.post('/review', recipeCon.submitReview);

router.get('/verify-email', recipeCon.verifyEmail);


// router.get('/verify-email', recipeCon.emailVerify)
// router.get('/autocomplete/:partialName', recipeCon.suggetion);


// Admin routes
router.get('/admin', adminCon.adminLogin);
router.post('/admin', adminCon.adminLoginVerify);
router.get('/admin-home', adminCon.adminHomeRender);
// router.post('/admin-home', adminCon.adminHome);
router.get('/insert-recipe', adminCon.submitRecipe);
router.post('/insert-recipe', adminCon.submitRecipeOnPost);
router.get('/update-recipe/:id', adminCon.updateRecipeRender);
router.post('/update-recipe/:id', adminCon.updateRecipe);
router.get('/delete/:id', adminCon.deleteData);
router.get('/admin-user-dash', adminCon.showUserRecipe);



// user panel routes 


router.get('/user-login', userCon.userLogin);
router.post('/user-login', userCon.userLoginVerify);
router.get('/user-register', userCon.userRegister);
router.post('/user-register', userCon.userRegisterVerify);
router.get('/user-dash', userCon.userDash);
router.get('/user-insert-recipe', userCon.InsertRecipeByUser); // user can insert recipe in this form
router.post('/user-insert-recipe', userCon.InsertRecipeByUserOnPost);
router.get('/user-update-recipe/:id/:status', userCon.updateRecipeByUser);
router.post('/user-update-recipe/:id/:status', userCon.updateRecipeByUserOnPost);
router.get('/user-delete-recipe/:id', userCon.deleteRecipeByUser);







module.exports = router;




//express validator use when we have to validate that email is already exist ,password lenght etc.

// router.post('/admin', [
//     // Validate email
//     check('email').isEmail().withMessage('Invalid email address'),

//     // Validate password
//     check('password').custom(async (value, { req }) => {
//         var email = req.body.email;
//         var user = await loginModel.findOne({ email: email });
//         if (value == !user.password) {
//             throw new Error('Password is not matched');
//         }
//     })

// ], adminCon.adminLoginVerify);